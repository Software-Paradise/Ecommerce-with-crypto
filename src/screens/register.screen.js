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
import {Colors} from '../utils/constants.util';
import {GlobalStyles} from '../styles/global.style';
import {RFValue} from 'react-native-responsive-fontsize';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import ButtonWithIcon from '../components/button-with-icon.component';
import IconButton from '../components/icon-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import ButtonSupport from '../components/buttonsupport.component';

const RegisterScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <LogoHeaderComponent title="Registro de compañía" />
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Nombre</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="person" color={Colors.$colorGray} size={18} />
            <TextInput
              placeholderTextColor={Colors.$colorGray}
              placeholder="Nombre completo"
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
              placeholder="Correo electrónico"
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
        <View style={registerStyles.phoneRow}>
          <View style={registerStyles.countryField}>
            <Text style={registerStyles.inputLabel}>País</Text>
            <View style={registerStyles.textInputWithImage}>
              <Icon size={18} color={Colors.$colorGray} name="location-on" />
              <TextInput
                placeholderTextColor={Colors.$colorGray}
                placeholder="País"
                style={registerStyles.textInputCol}
              />
              <TouchableOpacity style={registerStyles.touchableCol}>
                <Icon
                  color={Colors.$colorYellow}
                  size={18}
                  name="unfold-more"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={registerStyles.phoneField}>
            <Text style={registerStyles.inputLabel}>Número de Teléfono</Text>
            <View style={registerStyles.textInputWithImage}>
              <Icon name="phone" size={18} color={Colors.$colorGray} />
              <TextInput
                placeholderTextColor={Colors.$colorGray}
                placeholder="Teléfono"
                style={registerStyles.textInputCol}
              />
            </View>
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
                onPress={() => navigation.navigate('LegalData')}
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
