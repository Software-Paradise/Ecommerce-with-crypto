import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, errorMessage} from '../utils/constants.util';
import {GlobalStyles} from '../styles/global.style';
import {RFValue} from 'react-native-responsive-fontsize';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import ButtonWithIcon from '../components/button-with-icon.component';
import IconButton from '../components/icon-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import ButtonSupport from '../components/buttonsupport.component';
import {showMessage} from 'react-native-flash-message';

const RegisterScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Fields of form
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyRUC, setCompanyRUC] = useState('');

  // Handling data
  const _handleData = async () => {
    if (password !== confirmPassword) {
      console.log('Password does not match');
      errorMessage('La contraseña no coincide');
      showMessage({
        message: 'La contraseña no coincide',
        type: 'danger',
        position: 'top',
      });
    } else if (email === '') {
      console.log('Email is required');
      showMessage({
        message: 'Correo electronico requerido',
        autoHide: false,
        type: 'danger',
        position: 'top',
      });
    } else if (companyRUC === '') {
      console.log('Email is required');
      errorMessage('El codigo de la empresa es requerido');
    } else {
      navigation.navigate('LegalData', {
        commerceData: {companyName, email, username, password, companyRUC},
      });
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <LogoHeaderComponent title="Registro de compañía" />
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Nombre</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="person" color={Colors.$colorGray} size={18} />
            <TextInput
              value={companyName}
              onChangeText={value => setCompanyName(value)}
              placeholderTextColor={Colors.$colorGray}
              placeholder="Nombre de la compañia"
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Correo Electrónico</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="email" size={18} color={Colors.$colorGray} />
            <TextInput
              placeholderTextColor={Colors.$colorGray}
              value={email}
              onChangeText={value => setEmail(value)}
              keyboardType='email-address'
              placeholder="Correo electrónico"
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Nombre de usuario</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="person" size={18} color={Colors.$colorGray} />
            <TextInput
              placeholderTextColor={Colors.$colorGray}
              value={username}
              onChangeText={value => setUsername(value)}
              placeholder="Nombre de usuario"
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Contraseña</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon color={Colors.$colorGray} size={18} name="lock" />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={value => setPassword(value)}
              placeholderTextColor={Colors.$colorGray}
              secureTextEntry={!showPassword}
              style={registerStyles.textInputCol}
            />
            <TouchableOpacity
              onPress={(e) => setShowPassword(!showPassword)}
              style={registerStyles.touchableCol}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                color={Colors.$colorYellow}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Verificar contraseña</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon color={Colors.$colorGray} size={18} name="lock" />
            <TextInput
              placeholder="Repita su contraseña"
              value={confirmPassword}
              onChangeText={value => setConfirmPassword(value)}
              placeholderTextColor={Colors.$colorGray}
              secureTextEntry={!showPassword}
              style={registerStyles.textInputCol}
            />
            <TouchableOpacity
              onPress={(e) => setShowPassword(!showPassword)}
              style={registerStyles.touchableCol}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                color={Colors.$colorYellow}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>
            Código de Identificación de Empresa
          </Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="location-city" color={Colors.$colorGray} size={18} />
            <TextInput
              placeholderTextColor={Colors.$colorGray}
              value={companyRUC}
              onChangeText={value => setCompanyRUC(value)}
              placeholder="Código de empresa"
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={registerStyles.largeSpacing}>
          <View style={registerStyles.row}>
            <View
              style={{
                ...registerStyles.column,
                alignItems: 'flex-end',
                marginRight: 20,
              }}>
              <IconButton
                onPress={() => navigation.navigate('Login')}
                icon="arrow-left"
                type="filled"
              />
            </View>
            <View style={registerStyles.column}>
              <ButtonWithIcon
                onPress={() => _handleData()}
                text="Siguiente"
                icon="arrow-right"
                type="filled"
              />
            </View>
          </View>
        </View>
        <FooterComponent />
      </ScrollView>
      <ButtonSupport />
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
    paddingBottom: 5,
    paddingLeft: 15,
    color: Colors.$colorYellow,
  },
  phoneRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  countryField: {
    flex: 0.5,
    marginRight: 10,
  },
  phoneField: {
    flex: 0.5,
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
    position: 'absolute',
    bottom: '0%',
    right: '0%',
  },
  whatsappOpacity: {
    width: RFValue(128),
  },
  textInputWithImage: {
    ...GlobalStyles.textInput,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputCol: {
    flex: 0.9,
    color: 'white',
    paddingLeft: 5,
  },
  touchableCol: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  markerImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

export {registerStyles};

export default RegisterScreen;
