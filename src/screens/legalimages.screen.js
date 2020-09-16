import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import {Colors} from '../utils/constants.util';
import ImagePicker from 'react-native-image-picker';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import Icon from 'react-native-vector-icons/AntDesign';
import {registerStyles} from './register.screen';
import IconButton from '../components/icon-button';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';
import { RFValue } from 'react-native-responsive-fontsize';

// Options for React-Image-Picker
const RIPOptions = {
  title: 'Seleccionar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const uploadImage = () => {
  ImagePicker.showImagePicker(RIPOptions, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = {uri: response.uri};

      console.log(source);
    }
  });
};

const LegalImagesScreen = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <LogoHeaderComponent title="Adjuntar documentos legales" />
        <View style={legalImagesStyles.regularSpacing}>
          <Text style={registerStyles.inputLabel}>Permiso de operación</Text>
          <TouchableOpacity
            onPress={(e) => uploadImage()}
            style={{
              ...GlobalStyles.textInput,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingVertical: RFValue(10),
            }}>
            <Icon name="upload" size={18} color={Colors.$colorYellow} />
          </TouchableOpacity>
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <Text style={registerStyles.inputLabel}>
            Código de Identificación de Empresa
          </Text>
          <TouchableOpacity
            onPress={(e) => uploadImage()}
            style={{
              ...GlobalStyles.textInput,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingVertical: RFValue(10),
            }}>
            <Icon name="upload" size={18} color={Colors.$colorYellow} />
          </TouchableOpacity>
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <Text style={registerStyles.inputLabel}>Poder Administrativo</Text>
          <TouchableOpacity
            onPress={(e) => uploadImage()}
            style={{
              ...GlobalStyles.textInput,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingVertical: RFValue(10),
            }}>
            <Icon name="upload" size={18} color={Colors.$colorYellow} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...legalImagesStyles.regularSpacing,
            ...registerStyles.row,
            paddingVertical: 30,
          }}>
          <View
            style={{
              ...registerStyles.column,
              alignItems: 'flex-end',
              marginRight: 30,
            }}>
            <IconButton
              onPress={() => navigation.navigate('LegalData')}
              icon="arrow-left"
              type="filled"
            />
          </View>
          <View style={registerStyles.column}>
            <ButtonWithIcon
              onPress={() => navigation.navigate('Welcome')}
              text="Siguiente"
              icon="arrow-right"
              type="filled"
            />
          </View>
        </View>
        <FooterComponent />
      </ScrollView>
      <ButtonSupport />
    </SafeAreaView>
  );
};

const legalImagesStyles = StyleSheet.create({
  inputLabel: {
    color: Colors.$colorYellow,
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
  regularSpacing: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 0.5,
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
  logoAly: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },
  termsAndConditions: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: Colors.$colorYellow,
    textTransform: 'uppercase',
  },
});

export default LegalImagesScreen;
