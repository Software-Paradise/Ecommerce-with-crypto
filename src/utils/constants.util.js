import AsyncStorage from '@react-native-community/async-storage';
import {
  Platform,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';

import TouchID from 'react-native-touch-id';
import axios from 'axios';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import store from '../store/index';
import {SETPERMISSIONS, DELETESTORAGE, SETLOADER} from '../store/actionTypes';
import {showMessage} from 'react-native-flash-message';
import Toast from 'react-native-simple-toast';

const keyStorage = '@storage';

export const Colors = {
  $colorMain: '#1D1D1D',
  $colorBlack: '#151515',
  $colorSecondary: '#23AAB5',
  $colorBlue: '#3B66B7',
  $colorGray: '#707070',
  $colorYellow: '#FECB2E',
  $colorRed: '#B42C2C',
  $colorGreen: '#2E8B12',
};

export const logOutApp = async () => {
  await deleteStorage();

  store.dispatch({type: DELETESTORAGE});
};

export const loader = (payload = false) =>
  store.dispatch({type: SETLOADER, payload});

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
    const {permissions} = store.getState();

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

        store.dispatch({type: SETPERMISSIONS, payload});
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

      store.dispatch({type: SETPERMISSIONS, payload});
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
    const {permissions} = store.getState();

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

          store.dispatch({type: SETPERMISSIONS, payload});
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

const PORT = '3000';

export const serverAddress =
  Platform.OS === 'ios'
    ? `http://localhost:${PORT}`
    : `http://192.168.0.134:${PORT}`;


export const socketAddress = `http://192.168.0.134:${PORT}`;

export const http = axios.create({
  baseURL: serverAddress,
  validateStatus: (status) => {
    if (status === 401) {
      Alert.alert('AlyPay', 'Tu sesion ha caducado', [
        {
          text: 'OK',
        },
      ]);
      return true;
    } else {
      return status >= 200 && status < 300;
    }
  },
});

export const getHeaders = () => {
  const {token} = store.getState().global;

  return {
    headers: {
      'x-auth-token': token,
    },
  };
};
