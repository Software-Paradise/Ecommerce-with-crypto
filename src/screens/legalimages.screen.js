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
import {showMessage} from 'react-native-flash-message';
import TransactionScreen from './transaction.screen';
import Loader from '../components/loader.component';

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
  const [viewOperationPermission, setViewOperationPermission] = useState(false);
  const [RUCImage, setRUCImage] = useState(null);
  const [viewRucImage, setViewRucImage] = useState(false);
  const [legalPower, setLegalPower] = useState(null);
  const [viewLegalPower, setViewLegalPower] = useState(false);
  const [repID, setRepID] = useState(null);
  const [viewRepId, setViewRepId] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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

      setShowLoader(true);

      axios
        .post(
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
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((response) => {
          const result = response.data;

          if (result.error) {
            errorMessage(result.message);
            setShowLoader(false);
          } else if (result.success) {
            showMessage({
              message: 'Exito',
              description: 'La compañía se ha creado con éxito.',
              type: 'success',
            });
            setShowLoader(false);
            navigation.navigate('Welcome', {
              companyId: result.id,
            });
          }
        })
        .catch((error) => {
          setShowLoader(false);
          console.log('Error de request', error);
        });
    } catch (e) {
      errorMessage(e.message);
      setShowLoader(false);
    }
  };

  const uploadImage = (imageDestination) => {
    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      console.log('CAMERA');
      console.log(result);
    });
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
      console.log('STORAGE');
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
            setOperationPermission(response);
            setViewOperationPermission(true);
            break;
          }
          case 'ruc': {
            setRUCImage(response);
            setViewRucImage(true);
            break;
          }
          case 'legalPower': {
            setLegalPower(response);
            setViewLegalPower(true);
            break;
          }
          case 'repID': {
            setRepID(response);
            setViewRepId(true);
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
      {showLoader && <Loader isVisible={true}/>}
      <ScrollView>
        <LogoHeaderComponent title="Adjuntar documentos legales" />
        <View style={legalImagesStyles.regularSpacing}>
          <View style={legalImagesStyles.row}>
            <Text style={registerStyles.inputLabel}>
              Permiso de operación
            </Text>
            <TouchableOpacity
              onPress={(e) => uploadImage('operationPermission')}
              style={[
                GlobalStyles.textInput,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingVertical: RFValue(10),
                  paddingHorizontal: RFValue(20),
                },
              ]}>
              <Icon name="upload" size={18} color={Colors.$colorYellow} />
            </TouchableOpacity>
          </View>
          {viewOperationPermission && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{uri: operationPermission.uri}}
                style={legalImagesStyles.viewImageUpload}
              />
            </View>
          )}
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <View style={legalImagesStyles.row}>
            <Text style={registerStyles.inputLabel}>
              Código de Identificación de Empresa
            </Text>
            <TouchableOpacity
              onPress={(e) => uploadImage('ruc')}
              style={[
                GlobalStyles.textInput,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingVertical: RFValue(10),
                  paddingHorizontal: RFValue(20),
                },
              ]}>
              <Icon name="upload" size={18} color={Colors.$colorYellow} />
            </TouchableOpacity>
          </View>
          {viewRucImage && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{uri: RUCImage.uri}}
                style={legalImagesStyles.viewImageUpload}
              />
            </View>
          )}
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <View style={legalImagesStyles.row}>
            <Text style={registerStyles.inputLabel}>
              Poder administrativo
            </Text>
            <TouchableOpacity
              onPress={(e) => uploadImage('legalPower')}
              style={[
                GlobalStyles.textInput,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingVertical: RFValue(10),
                  paddingHorizontal: RFValue(20),
                },
              ]}>
              <Icon name="upload" size={18} color={Colors.$colorYellow} />
            </TouchableOpacity>
          </View>
          {viewLegalPower && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{uri: legalPower.uri}}
                style={legalImagesStyles.viewImageUpload}
              />
            </View>
          )}
        </View>
        <View style={legalImagesStyles.regularSpacing}>
          <View style={legalImagesStyles.row}>
            <Text style={registerStyles.inputLabel}>
              Identificación de representante legal
            </Text>
            <TouchableOpacity
              onPress={(e) => uploadImage('repID')}
              style={[
                GlobalStyles.textInput,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingVertical: RFValue(10),
                  paddingHorizontal: RFValue(20),
                },
              ]}>
              <Icon name="upload" size={18} color={Colors.$colorYellow} />
            </TouchableOpacity>
          </View>
          {viewRepId && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{uri: repID.uri}}
                style={legalImagesStyles.viewImageUpload}
              />
            </View>
          )}
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
              text="Finalizar"
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
    justifyContent: 'space-between',
    alignItems: 'center'
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
  viewImageUpload: {
    width: 90,
    height: 90,
    // resizeMode: "contain"
  },
});

export default LegalImagesScreen;
