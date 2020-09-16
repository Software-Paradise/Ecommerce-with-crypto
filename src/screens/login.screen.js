import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../utils/constants.util';
import {GlobalStyles} from '../styles/global.style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import ButtonSupport from '../components/buttonsupport.component';
import ButtonWithIcon from '../components/button-with-icon.component';

const LoginScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <LogoHeaderComponent title="Iniciar sesión" />
      <View style={{paddingTop: 20, paddingHorizontal: 20}}>
        <Text style={loginStyles.inputLabel}>Correo electrónico</Text>
        <View style={loginStyles.textInputWithImage}>
          <Icon size={20} name='email' color={Colors.$colorGray}/>
          <TextInput placeholderTextColor={Colors.$colorGray} placeholder="Correo electrónico" style={loginStyles.textInputCol} />
          <View style={GlobalStyles.touchableCol} />
        </View>
      </View>
      <View style={{paddingTop: 20, paddingHorizontal: 20}}>
        <Text style={loginStyles.inputLabel}>Contraseña</Text>
        <View style={loginStyles.textInputWithImage}>
          <Icon color={Colors.$colorGray} size={18} name='lock' />
          <TextInput
            secureTextEntry={!showPassword}
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
      <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            textAlign: 'right',
          }}>
        <TouchableOpacity>
          <Text style={loginStyles.forgotPasswordLabel}>
            ¿Ha olvidado su contraseña?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={loginStyles.horizontalContainer}>
        <View style={{...loginStyles.horizontalChild, marginRight: 10}}>
          <ButtonWithIcon text='Registrar' onPress={() => navigation.navigate('Register')} icon='store' type='filled'/>
        </View>
        <View style={{...loginStyles.horizontalChild, marginLeft: 10}}>
          <ButtonWithIcon text='Ingresar' icon='login' type='filled' />
        </View>
      </View>
      <ButtonSupport />

      <FooterComponent />
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
    paddingBottom: 5,
    paddingLeft: 15,
  },
  forgotPasswordLabel: {
    color: Colors.$colorGray,
    fontSize: 15,
    textAlign: 'right',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    backgroundColor: Colors.$colorMain,
    borderColor: Colors.$colorYellow,
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    fontSize: 15,
    color: 'white',
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
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
    marginEnd: 20,
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
    ...GlobalStyles.textInput,
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
