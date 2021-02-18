import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import Clipboard from '@react-native-community/clipboard'
import TouchID from 'react-native-touch-id'
import Toast from 'react-native-simple-toast'
import RNFetchBlob from 'rn-fetch-blob'
import store from '../store/index'
import { Platform, StyleSheet, StatusBar, Dimensions, Alert, Linking } from 'react-native'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import { SETPERMISSIONS, DELETESTORAGE, SETLOADER } from '../store/actionTypes'
import { showMessage } from 'react-native-flash-message'
import { isIphoneX } from 'react-native-iphone-x-helper'

const keyStorage = '@storage';

export const Colors = {
  $colorMain: "#000",
  $colorBlack: "#1d1d1d",
  $colorGray: "#CCC",
  $colorSecondary: "#9ed3da",
  $colorYellow: "#ffcb08",
  $colorRed: "#c0392b",
  $colorGreen: "#33d9b2",
}

const { height, width } = Dimensions.get("window")
const standardLength = width > height ? width : height
const offset =
  width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight // iPhone X style SafeAreaView size in portrait

const deviceHeight =
  isIphoneX() || Platform.OS === "android"
    ? standardLength - offset
    : standardLength

// guideline height for standard 5" device screen is 680
export const RFValue = (fontSize = 0, standardScreenHeight = 680) => {
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight
  return Math.round(heightPercent)
}

const buttonStyle = {
  alignItems: 'center',
  borderRadius: 50,
  justifyContent: 'center',
  padding: 10,
};

export const GlobalStyles = StyleSheet.create({
  button: buttonStyle,

  containerPicker: {
    backgroundColor: Colors.$colorMain,
    borderColor: Colors.$colorYellow,
    borderRadius: 5,
    borderWidth: 1.5,
    elevation: 5,
  },
  superContainer: {
    flex: 1,
  },
  picker: {
    paddingHorizontal: 0,
    color: '#FFF',
  },
  textInput: {
    backgroundColor: Colors.$colorMain,
    borderColor: Colors.$colorYellow,
    borderRadius: 5,
    borderWidth: 1.5,
    color: '#FFF',
    elevation: 5,
    padding: RFValue(10),
  },
  textButton: {
    color: Colors.$colorMain,
    // fontWeight: 'bold',
    fontSize: RFValue(18),
    textTransform: 'uppercase',
  },
  buttonNoBorder: {
    ...buttonStyle,
    borderWidth: 0,
  },
  buttonPrimaryLine: {
    ...buttonStyle,
    borderWidth: 1,
    borderColor: Colors.$colorYellow,
  },
  textButtonPrimaryLine: {
    color: Colors.$colorYellow,
    fontSize: RFValue(18),
    textTransform: 'uppercase',
  },
  buttonPrimary: {
    ...buttonStyle,
    backgroundColor: Colors.$colorYellow,
  },
  buttonSecondary: {
    ...buttonStyle,
    backgroundColor: Colors.$colorSecondary,
  },
  superContainer: {
    flex: 1,
    backgroundColor: Colors.$colorMain,
    position: 'relative',
  },
  textBody: {
    color: Colors.$colorYellow,
    fontSize: 18,
  },
  textTitle: {
    color: Colors.$colorYellow,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dotSevenColumn: {
    flex: 0.7,
  },
  dotThreeColumn: {
    flex: 0.3,
  },
  textInputWithImage: {
    // ...textInput,
    flexDirection: 'row',
  },
  textInputCol: {
    flex: 0.9,
    color: 'white',
  },
  touchableCol: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
});

export const logOutApp = async () => {
  await deleteStorage();

  store.dispatch({ type: DELETESTORAGE });
};

export const loader = (payload = false) =>
  store.dispatch({ type: SETLOADER, payload });

export const setStorage = async (json = {}) => {
  const data = JSON.stringify(json);

  await AsyncStorage.setItem(keyStorage, data);
};

export const deleteStorage = async () => {
  await AsyncStorage.removeItem(keyStorage);
};

export const getStorage = async () => {
  const storage = await AsyncStorage.getItem(keyStorage);

  if (storage) {
    return JSON.parse(storage);
  } else {
    return {};
  }
};

// Verificar permiso para acceder a camara
export const CheckCameraPermission = async () => {
  try {
    const { permissions } = store.getState();

    // Check permission of camera
    const checkPermission = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );

    if (checkPermission === RESULTS.DENIED) {
      // El permiso no se ha solicitado / se ha denegado pero se puede solicitar

      // Solicitamos permiso para ocupar la camara del dispositivo
      const requestPermission = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );

      if (requestPermission === RESULTS.GRANTED) {
        const payload = {
          camera: true,
        };

        store.dispatch({ type: SETPERMISSIONS, payload });
      }

      if (requestPermission === RESULTS.DENIED) {
        throw 'No podras escanear codigos de pago';
      }
    }

    if (checkPermission === RESULTS.BLOCKED) {
      throw 'Configura el permiso de tu camara a Alypay';
    }

    if (checkPermission === RESULTS.GRANTED) {
      const payload = {
        ...permissions,
        camera: true,
      };

      store.dispatch({ type: SETPERMISSIONS, payload });
    }
  } catch (description) {
    showMessage({
      backgroundColor: Colors.$colorRed,
      color: '#FFF',
      description: description.toString(),
      icon: 'warning',
      message: 'AlyPay',
      autoHide: false,
    });
  }
};

// Verificar permisos de TouchID
export const CheckTouchIDPermission = async () => {
  try {
    const { permissions } = store.getState();

    // Verificar si hay permisos en redux
    if (permissions.touchID === undefined) {
      await TouchID.isSupported()
        .then(async (biometricType) => {
          let touchID = null;

          if (biometricType === 'TouchID') {
            touchID = true;
          }

          const payload = {
            ...permissions,
            touchID,
          };

          store.dispatch({ type: SETPERMISSIONS, payload });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  } catch (error) {
    Toast.show(error.toString(), Toast.LONG);
  }
};

export const reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

export const errorMessage = (description = '') => {
  showMessage({
    message: 'Se ha producido un error',
    description,
    color: '#FFF',
    backgroundColor: Colors.$colorRed,
    icon: 'danger',
    duration: 5000,
  });
};

export const successMessage = (description = '', title = 'AlyPay') => {
  showMessage({
    message: title,
    description,
    color: '#FFF',
    backgroundColor: Colors.$colorGreen,
    icon: 'success',
  });
};

/**Muestra una notificacion con estilo global */
export const showNotification = (message = "", type = "info" | "error" | "warning") => {
  showMessage({
    message: "Alypay Ecommerce",
    description: message,
    color: "#FFF",
    backgroundColor: "#f39c12",
    icon: "warning",
    duration: 10000,
  })
}

const PORT = '3085';

export const serverAddress = Platform.OS === 'ios' ? `http://localhost:${PORT}` : `http://192.168.0.125:${PORT}`;

export const serverSpeedtradingsURL = "https://ardent-medley-272823.appspot.com";

//export const serverAddress = 'https://alypay.uc.r.appspot.com'

//export const serverAddress = 'http://staging.root-anvil-299019.appspot.com'; 
export const socketAddress = serverAddress;

// export const serverAddress = 'http://staging.root-anvil-299019.appspot.com'; 
// export const socketAddress = serverAddress;
//export const socketAddress = 'http://staging.root-anvil-299019.appspot.com/'


export const CopyClipboard = async (text = '') => {
  await Clipboard.setString(text);
  Toast.show('Copiado a portapeles', Toast.LONG);
};

// Convierete un blog en un archivo previsaulizable
export const readFile = (fileId) => new Promise(async (resolve, _) => {
  const { headers } = getHeaders()

  const response = await RNFetchBlob.config({ fileCache: true, appendExt: 'jpg' })
    .fetch('GET', `${serverAddress}/ecommerce/file/${fileId}`, headers)

  const base64 = await response.base64()
  resolve(`data:image/jpeg;base64,${base64}`)
})

/**
* Obtiene el porcentaje del fee según el monto ingresado y el tipo de fee a verificar
* @param {Number} amount - Monto actual
* @param {Number} feeType - tipo de fee (1=transacción, 2=retiro, 3=exchange)
*/
export const getFeePercentage = (amount, feeType, fees) => {
  console.log("FeeConst", fees)
  const enableFees = {
    1: 'transaction',
    2: 'retirement',
    3: 'exchange'
  }

  const currentFeeType = enableFees[feeType]

  const [firstFee, secondFee, lastFee] = fees[currentFeeType]

  // Se verifica sí el monto está dentro del primer rango
  if (amount <= firstFee.limit) {
    return firstFee
  }
  // Se verifica sí el monto está dentro del segundo rango
  if (amount > firstFee.limit && amount <= lastFee.limit) {
    return secondFee
  }
  // Se verifica sí el monto está dentro del último rango
  if (amount > lastFee.limit) {
    return lastFee
  }
  return {}
}


const http = axios.create({
  baseURL: serverAddress,
  timeout: 10 * 60 * 60,
  validateStatus: (status) => {
    if (status === 401) {
      Alert.alert('AlyPay', 'Tu sesion ha caducado', [
        {
          text: 'OK',
          // onPress: () => { }
          onPress: () => logOutApp()
        },
      ]);
      return true;
    } else {
      return status >= 200 && status < 300;
    }
  },
});

http.interceptors.request.use(config => {
  console.log(config.url)
  return config
})

export { http }

export const getHeaders = () => {
  const { token } = store.getState().global;

  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

/**Metodo tradicional para verificar los permisos de la camara */
export const checkPermissionCamera = () => new Promise(async (resolve, reject) => {
  try {
    await request(PERMISSIONS.ANDROID.CAMERA)
    const result = await check(PERMISSIONS.ANDROID.CAMERA)

    // verificamos los tres posibles errores de permisos
    switch (result) {
      case RESULTS.DENIED: {
        throw String("Permiso de camara denegado")
      }

      case RESULTS.BLOCKED: {
        throw String("El permiso está denegado y ya no se puede solicitar")
      }

      case RESULTS.UNAVAILABLE: {
        throw String("Esta función no está disponible")
      }
    }

    resolve()
  } catch (error) {
    reject(error)
  }
})

export const checkPermisionLocation = () => new Promise(async (resolve, reject) => {
  try {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    const auth = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)

    // verificamos los posibles errores de permisos
    switch (auth) {
      case RESULTS.DENIED: {
        throw String('Permiso de Localizacion denegados')
      }

      case RESULTS.UNAVAILABLE: {
        throw String('Esta función no esta disponible')
      }
    }
    resolve()
  } catch (error) {
    reject(error)
  }
})

/**Abre la app de whatsapp para soporte */
export const OpenSupport = () => Linking.openURL('https://wa.me/+50585570529')
