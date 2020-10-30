import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Colors} from '../utils/constants.util';
import {GlobalStyles} from '../styles/global.style';
import LogoHeaderComponent from '../components/logoheader.component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterComponent from '../components/footer.component';
import {registerStyles} from './register.screen';
import IconButton from '../components/icon-button';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-community/picker';
import * as CoreService from './../services/core.services';
import { showMessage } from 'react-native-flash-message';
import {useRoute} from '@react-navigation/native';

const LegalDataScreen = ({navigation}) => {
  const [currency, setCurrency] = useState('btc');
  const route = useRoute();
  const DOCUMENT_TYPE = [
    {
      name: 'Cedula',
      value: 1,
    },
    {
      name: 'Pasaporte',
      value: 2,
    },
  ];
  const [repFirstName, setFirstname] = useState('');
  const [repLastName, setLastname] = useState('');
  const [repEmail, setEmail] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [country, setCountry] = useState('');
  const [repPhone, setPhone] = useState('');
  const [repIDType, setDoctype] = useState(1);
  const [repIdNumber, setIdNumber] = useState('');

  const getOptions = async () => {
    const countries = await CoreService.getCountries();
  }

  const _handleSubmit = async () => {
    if (repFirstName === '') {
      showMessage({
        message: 'Nombre requerido',
        type: 'danger',
      })
    } else if (repLastName === '') {
      showMessage({
        message: 'Apellido requerido',
        type: 'danger',
      });
    } else if (repEmail === '') {
      showMessage({
        message: 'Correo electronico requerido',
        type: 'danger'
      });
    } else if (repPhone === '') {
      showMessage({
        message: 'Telefono requerido',
        type: 'danger'
      });
    } else if (repIdNumber === '') {
      showMessage({
        message: 'Identificacion requerida',
        type: 'danger'
      });
    } else {

      const legalData = {
        repFirstName,
        repLastName,
        repEmail,
        country,
        repPhone,
        repIDType,
        repIdNumber,
        phoneCode: '',
      };
      const data = {
        ...route.params.commerceData,
        ...legalData,
      };
      navigation.navigate('LegalImages', {companyData: data});
    }
  }
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <LogoHeaderComponent title="Representante legal" />
        <View style={legalDataStyles.spacing}>
          <Text style={legalDataStyles.inputLabel}>Nombre</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="person" size={18} color={Colors.$colorGray} />
            <TextInput
              placeholder="Nombre"
              value={repFirstName}
              onChangeText={(value) => setFirstname(value)}
              placeholderTextColor={Colors.$colorGray}
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={legalDataStyles.spacing}>
          <Text style={legalDataStyles.inputLabel}>Apellido</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="person" size={18} color={Colors.$colorGray} />
            <TextInput
              value={repLastName}
              onChangeText={(value) => setLastname(value)}
              placeholder="Apellido"
              placeholderTextColor={Colors.$colorGray}
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={legalDataStyles.spacing}>
          <Text style={legalDataStyles.inputLabel}>Correo electrónico</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="email" color={Colors.$colorGray} size={18} />
            <TextInput
              placeholder="Correo electrónico"
              value={repEmail}
              onChangeText={(value) => setEmail(value)}
              placeholderTextColor={Colors.$colorGray}
              style={registerStyles.textInputCol}
            />
            <View style={registerStyles.touchableCol} />
          </View>
        </View>
        <View style={registerStyles.phoneRow}>
          <View style={registerStyles.countryField}>
            <Text style={registerStyles.inputLabel}>País</Text>
            <View style={registerStyles.textInputWithImage}>
              <Icon name="location-on" size={18} color={Colors.$colorGray} />
              <TextInput
                placeholder="País"
                value={country}
                onChangeText={(value) => setCountry(value)}
                placeholderTextColor={Colors.$colorGray}
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
            <Text style={legalDataStyles.inputLabel}>Número de Teléfono</Text>
            <View style={registerStyles.textInputWithImage}>
              <Icon name="phone" size={18} color={Colors.$colorGray} />
              <TextInput
                style={registerStyles.textInputCol}
                value={repPhone}
                onChangeText={(value) => setPhone(value)}
                placeholder="Teléfono"
                placeholderTextColor={Colors.$colorGray}
              />
            </View>
          </View>
        </View>
        <View style={registerStyles.spacing}>
          <Text style={registerStyles.inputLabel}>Tipo de identificación</Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="portrait" color={Colors.$colorGray} size={18} />
            <Picker
              selectedValue={repIDType}
              onValueChange={(itemValue) => setDoctype(itemValue)}
              style={registerStyles.textInputCol}>
              {DOCUMENT_TYPE.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.value} />
              ))}
            </Picker>
            <TouchableOpacity style={registerStyles.touchableCol}>
              <Icon name="unfold-more" size={18} color={Colors.$colorYellow} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={legalDataStyles.spacing}>
          <Text style={registerStyles.inputLabel}>
            Número de Identificación
          </Text>
          <View style={registerStyles.textInputWithImage}>
            <Icon name="portrait" color={Colors.$colorGray} size={18} />
            <TextInput
              style={registerStyles.textInputCol}
              value={repIdNumber}
              onChangeText={(value) => setIdNumber(value)}
              placeholder="Numero de identificacion"
              placeholderTextColor={Colors.$colorGray}
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
                onPress={() => navigation.navigate('Register')}
                icon="arrow-left"
                type="filled"
              />
            </View>
            <View style={registerStyles.column}>
              <ButtonWithIcon
                onPress={_handleSubmit}
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
  console.log('Printing support');
};

const legalDataStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.$colorBlack,
    paddingTop: 10,
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
    paddingRight: 25,
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
  },
  whatsappOpacity: {
    height: 100,
  },
});

export default LegalDataScreen;
