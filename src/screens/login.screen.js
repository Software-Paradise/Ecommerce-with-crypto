import React, { useEffect, useReducer, useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Colors,
  errorMessage,
  reducer,
  setStorage,
  http,
} from '../utils/constants.util';
import validator from 'validator';
import { GlobalStyles } from '../styles/global.style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import ButtonSupport from '../components/buttonsupport.component';
import ButtonWithIcon from '../components/button-with-icon.component';
import { SETNAVIGATION, SETSTORAGE } from '../store/actionTypes';
import { showMessage } from 'react-native-flash-message';
import store from '../store';
import {
  getBrand,
  getDeviceId,
  getMacAddress,
  getSystemName,
} from 'react-native-device-info';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../components/loader.component';

const initialState = {
  email: '',
  password: '',

  // Device info
  ipAddress: '',
  device: '',
  macAddress: '',
  systemName: '',
};

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showLoader, setShowLoader] = useState(false);

  /**
   * Metodo que se ejecuta cuando el usuario hace login
   */
  const onSubmit = async () => {
    try {
      setShowLoader(true)
      if (!validator.isEmail(state.email.trim())) {
        throw 'Correo electronico no es valido';
      }

      if (state.password.length === 0) {
        throw 'Ingrese una contraseña';
      }

      const variables = {
        email: state.email,
        password: state.password,
        public_ip: state.ipAddress || '',
        device: state.device || '',
        mac_address: state.macAddress || '',
        system_name: state.systemName || '',
      };
      console.log(variables);

      const response = await http.post('/ecommerce/login', variables);

      const { data } = response;

      if (data.error) {
        throw String(data.message);
      } else {
        console.log('Success');
        if (Object.values(data).length > 0) {
          store.dispatch({ type: SETSTORAGE, payload: data });

          setStorage(data);
        }
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: error.toString(),
        description: 'Error al autenticar',
        color: '#FFF',
        backgroundColor: Colors.$colorRed,
        icon: 'warning',
      });
    } finally {
      setShowLoader(false)
    }
  };

  const getDeviceInfo = async () => {
    try {
      // getIP().then((payload) => dispatch({type: 'ipAddress', payload}));

      const device = await getBrand();
      const deviceId = await getDeviceId();

      dispatch({ type: 'device', payload: `${device} - ${deviceId}` });

      await getMacAddress().then((payload) =>
        dispatch({ type: 'macAddress', payload }),
      );

      const systemVersion = await getSystemName();

      dispatch({ type: 'systemName', payload: systemVersion });
    } catch (error) {
      errorMessage(error.toString());
    }
  };

  useEffect(() => {
    store.dispatch({ type: SETNAVIGATION, payload: navigation });

    getDeviceInfo();
  }, [navigation]);

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      {showLoader && <Loader isVisible={true} />}
      <ScrollView>
        <LogoHeaderComponent title="Iniciar sesión" />
        <View style={{ paddingTop: RFValue(20), paddingHorizontal: RFValue(20) }}>
          <Text style={loginStyles.inputLabel}>Correo electrónico</Text>
          <View
            style={[loginStyles.textInputWithImage, GlobalStyles.textInput]}>
            <Icon size={RFValue(20)} name="email" color={Colors.$colorGray} />
            <TextInput
              value={state.email}
              keyboardType="email-address"
              onChangeText={(payload) => dispatch({ type: 'email', payload })}
              placeholderTextColor={Colors.$colorGray}
              placeholder="Correo electrónico"
              style={loginStyles.textInputCol}
            />
            <View style={GlobalStyles.touchableCol} />
          </View>
        </View>

        <View style={{ paddingTop: RFValue(20), paddingHorizontal: RFValue(20) }}>
          <Text style={loginStyles.inputLabel}>Contraseña</Text>
          <View
            style={[loginStyles.textInputWithImage, GlobalStyles.textInput]}>
            <Icon color={Colors.$colorGray} size={RFValue(18)} name="lock" />
            <TextInput
              secureTextEntry={!showPassword}
              value={state.password}
              onChangeText={(payload) => dispatch({ type: 'password', payload })}
              placeholder="Contraseña"
              placeholderTextColor={Colors.$colorGray}
              style={loginStyles.textInputCol}
            />
            <TouchableOpacity
              onPress={(e) => setShowPassword(!showPassword)}
              style={loginStyles.touchableCol}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                color={Colors.$colorYellow}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingVertical: 10, paddingHorizontal: 20, textAlign: 'right' }}>
          <TouchableOpacity>
            <Text style={loginStyles.forgotPasswordLabel}>¿Ha olvidado su contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.horizontalContainer}>
          <View style={{ ...loginStyles.horizontalChild, marginRight: 10 }}>
            <ButtonWithIcon
              text="Registrar"
              onPress={() => navigation.navigate('LegalImages')}
              icon="store"
              type="filled"
            />
          </View>
          <View style={{ ...loginStyles.horizontalChild, marginLeft: 10 }}>
            <ButtonWithIcon
              onPress={onSubmit}
              text="Ingresar"
              icon="login"
              type="filled"
            />
          </View>
        </View>
        <ButtonSupport />

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.$colorBlack,
    flex: 1,
  },
  textTitle: {
    color: Colors.$colorYellow,
    fontSize: RFValue(26),
    fontWeight: 'bold',
  },
  viewChild: {
    backgroundColor: Colors.$colorMain,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputLabel: {
    color: Colors.$colorYellow,
    paddingBottom: RFValue(5),
    paddingLeft: RFValue(15),
  },
  forgotPasswordLabel: {
    color: Colors.$colorGray,
    fontSize: RFValue(15),
    textAlign: 'right',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    backgroundColor: Colors.$colorMain,
    borderColor: Colors.$colorYellow,
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: RFValue(5),
    marginHorizontal: RFValue(20),
    marginVertical: RFValue(10),
    padding: RFValue(10),
    fontSize: RFValue(15),
    color: 'white',
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(25),
  },
  horizontalChild: {
    flex: 0.5,
  },
  buttonFilled: {
    color: 'white',
    backgroundColor: Colors.$colorYellow,
    borderColor: Colors.$colorYellow,
    borderWidth: 3,
    borderRadius: 25,
    marginEnd: RFValue(20),
  },
  buttonOutlined: {
    color: 'white',
    borderColor: Colors.$colorYellow,
    borderWidth: 3,
    borderRadius: 25,
    marginStart: 20,
  },
  logo: {
    width: RFValue(300),
    height: RFValue(100),
    marginBottom: RFValue(40),
  },
  logoAly: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  textInputWithImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputCol: {
    flex: 0.9,
    paddingLeft: 5,
    color: 'white',
  },
  touchableCol: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
});

export default LoginScreen;
