import React from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import Lottie from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../utils/constants.util';
import {GlobalStyles} from '../styles/global.style';
import WhatsAppIconAnimation from './../animations/whatsapp.animation.json';

const RegisterScreen = ({navigation}) => {
  return (
    <SafeAreaView style={registerStyles.container}>
      <View>
        <Image
          style={registerStyles.logo}
          source={require('./../assets/img/logo.png')}
        />
      </View>
      <View style={registerStyles.titleContainer}>
        <Text style={registerStyles.textTitle}>Registro de compañía</Text>
      </View>
      <View style={registerStyles.spacing}>
        <Text style={registerStyles.inputLabel}>Nombre</Text>
        <TextInput style={GlobalStyles.textInput} />
      </View>
      <View style={registerStyles.spacing}>
        <Text style={registerStyles.inputLabel}>Correo Electrónico</Text>
        <TextInput style={GlobalStyles.textInput} />
      </View>
      <View style={registerStyles.phoneRow}>
        <View style={registerStyles.countryField}>
          <Text style={registerStyles.inputLabel}>País</Text>
          <TextInput style={GlobalStyles.textInput} />
        </View>
        <View style={registerStyles.phoneField}>
          <Text style={registerStyles.inputLabel}>Número de Teléfono</Text>
          <TextInput style={GlobalStyles.textInput} />
        </View>
      </View>
      <View style={registerStyles.spacing}>
        <Text style={registerStyles.inputLabel}>
          Código de Identificación de Empresa
        </Text>
        <TextInput style={GlobalStyles.textInput} />
      </View>
      <View style={registerStyles.largeSpacing}>
        <View style={registerStyles.row}>
          <View style={registerStyles.column}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={GlobalStyles.buttonNoBorder}>
              <Text style={{...GlobalStyles.textButtonPrimaryLine, textTransform: 'capitalize'}}>Volver</Text>
            </TouchableOpacity>
          </View>
          <View style={registerStyles.column}>
            <TouchableOpacity style={GlobalStyles.buttonPrimaryLine}>
              <Text style={GlobalStyles.textButtonPrimaryLine}>siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={registerStyles.supportContainer} >
        <TouchableOpacity>
          <Lottie style={registerStyles.whatsappOpacity} source={WhatsAppIconAnimation} resizeMode='cover' autoPlay loop={false}/>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/img/logo-aly.png')}
          style={registerStyles.logoAly}
        />
        <TouchableOpacity onPress={contactSupport()} style={GlobalStyles.buttonNoBorder}>
          <Text style={registerStyles.termsAndConditions}>
            Términos y condiciones
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const contactSupport = () => {
  console.log('Printing support button');
};

const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.$colorBlack,
    paddingTop: 60,
  },
  logo: {
    width: 400,
    height: 100,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  textTitle: {
    color: Colors.$colorYellow,
    fontSize: 26,
  },
  inputLabel: {
    fontSize: 15,
    color: Colors.$colorYellow,
  },
  phoneRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  countryField: {
    flex: 0.2,
    marginRight: 10,
  },
  phoneField: {
    flex: 0.8,
  },
  spacing: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  largeSpacing: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 0.5,
  },
  termsAndConditions: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: Colors.$colorYellow,
    textTransform: 'uppercase',
  },
  logoAly: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },
  topPadding: {
    paddingTop: 30,
  },
  supportContainer: {
    alignItems: 'center',
    padding: 10,
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
  },
  whatsappOpacity: {
    height: 100,
  },
});

export default RegisterScreen;
