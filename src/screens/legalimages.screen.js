import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import {Colors, errorMessage} from '../utils/constants.util';
import ImagePicker from 'react-native-image-picker';
import LogoHeaderComponent from '../components/logoheader.component';
import FooterComponent from '../components/footer.component';
import Icon from 'react-native-vector-icons/AntDesign';
import {registerStyles} from './register.screen';
import IconButton from '../components/icon-button';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';
import {RFValue} from 'react-native-responsive-fontsize';
import {PERMISSIONS, request} from 'react-native-permissions';
import {useRoute} from '@react-navigation/native';
import * as axios from 'axios';
import {serverAddress} from './../utils/constants.util';

// Options for React-Image-Picker
const RIPOptions = {
  title: 'Seleccionar',
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const LegalImagesScreen = ({navigation}) => {
  const [operationPermission, setOperationPermission] = useState(null);
  const [RUCImage, setRUCImage] = useState(null);
  const [legalPower, setLegalPower] = useState(null);
  const [repID, setRepID] = useState(null);
  const route = useRoute();

  const _createFormData = (
    operationPermission,
    rucImage,
    legalPower,
    repID,
    body,
  ) => {
    const data = new FormData();

    data.append('operationPermission', {
      name: operationPermission.fileName,
      type: operationPermission.type,
      uri:
        Platform.OS === 'android'
          ? operationPermission.uri
          : operationPermission.uri.replace('file://', ''),
    });

    data.append('rucImage', {
      name: rucImage.fileName,
      type: rucImage.type,
      uri:
        Platform.OS === 'android'
          ? rucImage.uri
          : rucImage.uri.replace('file://', ''),
    });

    data.append('repLegalPower', {
      name: legalPower.fileName,
      type: legalPower.type,
      uri:
        Platform.OS === 'android'
          ? legalPower.uri
          : legalPower.uri.replace('file://', ''),
    });

    data.append('repIdDocument', {
      name: repID.fileName,
      type: repID.type,
      uri:
        Platform.OS === 'android'
          ? repID.uri
          : repID.uri.replace('file://', ''),
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  const _handleSubmit = async () => {
    try {
      axios.post(
        `${serverAddress}/ecommerce/company/register`,
        _createFormData(
          operationPermission,
          RUCImage,
          legalPower,
          repID,
          route.params.companyData,
        ),
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        }
      ).then((response) => {
        console.log(response);
      }).catch(error => {
        console.log('Error de request', error.message);
      })
    } catch (e) {
      errorMessage(e.message);
    }
  };

  const uploadImage = (imageDestination) => {
    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      console.log('CAMERA')
      console.log(result);
    });
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
      console.log('STORAGE')
      console.log(result);
    });
    ImagePicker.showImagePicker(RIPOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        switch (imageDestination) {
          case 'operationPermission': {
            console.log('Operation Permission', response);
            setOperationPermission(response);
            console.log('Operation permission state: ', operationPermission);
            break;
          }
          case 'ruc': {
            console.log('RUC', response);
            setRUCImage(response);
            break;
          }
          case 'legalPower': {
            console.log('Legal', response);
            setLegalPower(response);
            break;
          }
          case 'repID': {
            console.log('Representative', response);
            setRepID(response);
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <LogoHeaderComponent title="Adjuntar documentos legales" />
        <View style={legalImagesStyles.regularSpacing}>
          <Text style={registerStyles.inputLabel}>Permiso de operación</Text>
          <TouchableOpacity
            onPress={(e) => uploadImage('operationPermission')}
            style={{
              ...GlobalStyles.textInput,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingVertical: RFValue(10),
            }}>
            <Icon name="upload" size={18} color={Colors.$colorYellow} />
            {operationPermission !== null ? <Image source={{uri: operationPermission.uri}} width='100' height='100'/> : null}
          </TouchableOpacity>
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <Text style={registerStyles.inputLabel}>
            Código de Identificación de Empresa
          </Text>
          <TouchableOpacity
            onPress={(e) => uploadImage('ruc')}
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
            onPress={(e) => uploadImage('legalPower')}
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
            Identificación representante legal
          </Text>
          <TouchableOpacity
            onPress={(e) => uploadImage('repID')}
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
              onPress={_handleSubmit}
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
