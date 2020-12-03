import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors, errorMessage, http } from '../utils/constants.util';
import { GlobalStyles } from '../styles/global.style';
import LogoHeaderComponent from '../components/logoheader.component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterComponent from '../components/footer.component';
import { registerStyles } from './register.screen';
import IconButton from '../components/icon-button';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-community/picker';
import { showMessage } from 'react-native-flash-message';
import { useRoute } from '@react-navigation/native';

import { RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';

const LegalDataScreen = ({ navigation }) => {
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
  const [country, setCountry] = useState(10);
  const [showCountries, setShowCountries] = useState(false);
  const [filter, setFilter] = useState('');
  const [repPhone, setPhone] = useState('');
  const [repIDType, setDoctype] = useState(1);
  const [repIdNumber, setIdNumber] = useState('');

  const ConfigurateComponent = async () => {
    try {
      const { data } = await http.get('/register/countries');

      setCountryOptions(data);
    } catch (error) {
      errorMessage(error.toString());
    }
  };

  const selectedCountry = (item) => {
    console.log(item);
    setCountry(item);
    setShowCountries(false);
  };

  const toggleModalCountries = () => {
    setShowCountries(true);
  };

  const ItemCountry = ({ item, index }) => {
    if (
      item.name.length > 0 &&
      item.name.toLowerCase().search(filter.toLocaleLowerCase()) > -1
    ) {
      return (
        <TouchableOpacity
          style={legalDataStyles.itemCountry}
          key={index}
          onPress={(_) => selectedCountry(index)}>
          <Text style={{ color: '#FFF' }}>{item.name}</Text>
          <Text style={{ color: Colors.$colorYellow }}>{item.phoneCode}</Text>
        </TouchableOpacity>
      );
    }
  };

  useEffect(() => {
    ConfigurateComponent();
  }, []);

  const _handleSubmit = async () => {
    if (repFirstName === '') {
      showMessage({
        message: 'Nombre requerido',
        type: 'danger',
      });
    } else if (repLastName === '') {
      showMessage({
        message: 'Apellido requerido',
        type: 'danger',
      });
    } else if (repEmail === '') {
      showMessage({
        message: 'Correo electronico requerido',
        type: 'danger',
      });
    } else if (repPhone === '') {
      showMessage({
        message: 'Telefono requerido',
        type: 'danger',
      });
    } else if (repIdNumber === '') {
      showMessage({
        message: 'Identificacion requerida',
        type: 'danger',
      });
    } else {
      const legalData = {
        repFirstName,
        repLastName,
        repEmail,
        country: countryOptions[country].name,
        repPhone,
        repIDType,
        repIdNumber,
        phoneCode: countryOptions[country].phoneCode,
      };
      const data = {
        ...route.params.commerceData,
        ...legalData,
      };
      navigation.navigate('LegalImages', { companyData: data });
    }
  };
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <Modal
        animationIn="fadeIn"
        backdropOpacity={0.9}
        animationOut="fadeOut"
        onBackdropPress={(_) => setShowCountries(false)}
        onBackButtonPress={(_) => setShowCountries(false)}
        isVisible={showCountries}>
        <View style={legalDataStyles.containerModal}>
          <TextInput
            style={registerStyles.TextInput}
            placeholder="Buscar"
            placeholderTextColor="#FFF"
            value={filter}
            onChangeText={(value) => setFilter(value)}
          />
          <View style={{ height: 10 }} />
          <FlatList
            keyboardShouldPersistTaps="always"
            data={countryOptions}
            renderItem={ItemCountry}
            keyExtractor={(_, i) => i.toString()}
          />
        </View>
      </Modal>
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
        {countryOptions.length > 0 && (
          <>
            <Text style={registerStyles.inputLabel}>Numero de telefono</Text>

            <View style={{ marginLeft: RFValue(20) }}>
              <View style={legalDataStyles.rowPhoneNumber}>
                <TouchableOpacity
                  style={[
                    GlobalStyles.textInput,
                    {
                      paddingVertical: RFValue(15),
                      paddingHorizontal: RFValue(20),
                      marginRight: RFValue(8),
                    },
                  ]}
                  onPress={(_) => toggleModalCountries(true)}>
                  <Text style={{ color: Colors.$colorYellow }}>
                    {countryOptions[country].phoneCode}
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={[GlobalStyles.textInput, { flex: 0.9 }]}
                  value={repPhone}
                  autoCorrect={false}
                  keyboardType="numeric"
                  keyboardAppearance="dark"
                  onChangeText={(value) => setPhone(value)}
                />
              </View>
            </View>
          </>
        )}
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
  rowPhoneNumber: {
    alignItems: "center",
    flexDirection: "row",
    flex: 0.8,
  },

  containerModal: {
    alignSelf: "center",
    backgroundColor: Colors.$colorMain,
    borderRadius: 10,
    padding: 10,
    height: "80%",
    width: "80%",
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
  selectCodeCountry: {
    borderRadius: 5,
    backgroundColor: Colors.colorBlack,
    padding: 10,
  },
  itemCountry: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default LegalDataScreen;
