import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import LogoHeaderComponent from '../components/logoheader.component';
import {Colors} from '../utils/constants.util';
import FooterComponent from '../components/footer.component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {registerStyles} from './register.screen';
import MapView, {Marker} from 'react-native-maps';
import RNLocation from 'react-native-location';
import Modal from 'react-native-modal';
import IconButton from '../components/icon-button';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';
import {SafeAreaView} from 'react-native-safe-area-context';

let CURRENT_LOCATION = {};

RNLocation.configure({
  distanceFilter: 100, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});

RNLocation.requestPermission({
  ios: 'whenInUse',
  android: {
    detail: 'coarse',
  },
}).then((granted) => {
  // eslint-disable-next-line no-unused-vars
  const locationSubscription = RNLocation.subscribeToLocationUpdates(
    (locations) => {
      CURRENT_LOCATION = locations[locations.length - 1];
    },
  );
});

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const RegisterCommerceScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [commerceName, setCommerceName] = useState('');
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [location, setLocation] = useState({
    latitude: CURRENT_LOCATION.latitude,
    longitude: CURRENT_LOCATION.longitude,
  });

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <ScrollView>
        <View style={RegisterCommerceStyles.container}>
          <LogoHeaderComponent title="Registro de comercio" />
          <View style={RegisterCommerceStyles.form}>
            <View style={RegisterCommerceStyles.formControl}>
              <View style={GlobalStyles.row}>
                <View style={GlobalStyles.dotSevenColumn}>
                  <Text style={registerStyles.inputLabel}>
                    Nombre de comercio
                  </Text>
                  <View style={registerStyles.textInputWithImage} >
                    <Icon name='store' size={18} color={Colors.$colorGray} />
                    <TextInput
                        placeholder='Nombre de comercio'
                        placeholderTextColor={Colors.$colorGray}
                        value={commerceName}
                        onChange={($event) => setCommerceName($event.target.value)}
                        style={registerStyles.textInputCol}
                    />
                    <View style={registerStyles.touchableCol}/>
                  </View>

                </View>
                <View style={{...GlobalStyles.dotThreeColumn, marginLeft: 10}}>
                  <Text style={registerStyles.inputLabel}>
                    Código postal
                  </Text>
                  <View style={registerStyles.textInputWithImage}>
                    <Icon name='location-on' color={Colors.$colorGray} size={18}/>
                    <TextInput placeholder='ZIP' placeholderTextColor={Colors.$colorGray} style={registerStyles.textInputCol} />
                    <View style={registerStyles.touchableCol}/>
                  </View>
                </View>
              </View>
            </View>
            <View style={RegisterCommerceStyles.formControl}>
              <Text style={registerStyles.inputLabel}>
                Correo electrónico
              </Text>
              <View style={registerStyles.textInputWithImage}>
                <Icon name='email' size={18} color={Colors.$colorGray}/>
                <TextInput placeholder='Correo electrónico' placeholderTextColor={Colors.$colorGray} style={registerStyles.textInputCol} />
                <View style={registerStyles.touchableCol}/>
              </View>
            </View>
            <View style={RegisterCommerceStyles.formControl}>
              <Text style={registerStyles.inputLabel}>Contraseña</Text>
              <View style={registerStyles.textInputWithImage}>
                <Icon name='lock' color={Colors.$colorGray} size={18}/>
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder='Contraseña'
                  placeholderTextColor={Colors.$colorGray}
                  style={registerStyles.textInputCol}
                />
                <TouchableOpacity
                  onPress={(e) => setShowPassword(!showPassword)}
                  style={GlobalStyles.touchableCol}>
                  <Icon
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    color={Colors.$colorYellow}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={RegisterCommerceStyles.formControl}>
              <Text style={registerStyles.inputLabel}>Verificar contraseña</Text>
              <View style={registerStyles.textInputWithImage}>
                <Icon name='lock' color={Colors.$colorGray} size={18}/>
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder='Repita su contraseña'
                  placeholderTextColor={Colors.$colorGray}
                  style={registerStyles.textInputCol}
                />
                <TouchableOpacity
                  onPress={(e) => setShowPassword(!showPassword)}
                  style={GlobalStyles.touchableCol}>
                  <Icon
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    color={Colors.$colorYellow}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={RegisterCommerceStyles.smallSpacing}>
              <Text style={registerStyles.inputLabel}>
                Dirección Física
              </Text>
            </View>
            <Modal isVisible={showFullScreen}>
              <View style={RegisterCommerceStyles.mapFullScreen}>
                <MapView
                  style={RegisterCommerceStyles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  onMarkerDragEnd={(event) =>
                    setLocation({
                      latitude: event.nativeEvent.coordinate.latitude,
                      longitude: event.nativeEvent.coordinate.longitude,
                    })
                  }>
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={commerceName}
                    pinColor={Colors.$colorYellow}
                    draggable={true}
                    id="commerce-location"
                    zIndex={9999}
                  />
                </MapView>
                <TouchableOpacity
                  onPress={(e) => setShowFullScreen(!showFullScreen)}
                  style={RegisterCommerceStyles.fullScreenButton}>
                  <Icon
                    name={showFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={RegisterCommerceStyles.mapContainer}>
              <MapView
                style={RegisterCommerceStyles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                onMarkerDragEnd={(event) =>
                  setLocation({
                    latitude: event.nativeEvent.coordinate.latitude,
                    longitude: event.nativeEvent.coordinate.longitude,
                  })
                }>
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={commerceName}
                  pinColor={Colors.$colorYellow}
                  draggable={true}
                  id="commerce-location"
                  zIndex={9999}
                />
              </MapView>
              <TouchableOpacity
                onPress={(e) => setShowFullScreen(!showFullScreen)}
                style={RegisterCommerceStyles.fullScreenButton}>
                <Icon
                  name={showFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...RegisterCommerceStyles.row,
                ...RegisterCommerceStyles.spacing,
              }}>
              <ButtonWithIcon text='REGISTRAR' icon='store' type='filled'/>
            </View>
            <FooterComponent />
          </View>
        </View>
      </ScrollView>
      <ButtonSupport/>
    </SafeAreaView>
  );
};

const RegisterCommerceStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  spacing: {
    paddingVertical: 25,
  },
  smallSpacing: {
    paddingVertical: 10,
  },
  column: {
    flex: 0.5,
  },
  inputLabel: {
    color: Colors.$colorYellow,
    fontSize: 15,
  },
  form: {
    paddingVertical: 25,
  },
  formControl: {
    paddingBottom: 10,
  },
  markerImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  textInputWithImage: {
    ...GlobalStyles.textInput,
    flexDirection: 'row',
  },
  textInputCol: {
    flex: 0.9,
  },
  touchableCol: {
    flex: 0.1,
    alignItems: 'flex-end',
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
  mapContainer: {
    flex: 1,
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  mapFullScreen: {
    height: 500,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  fullScreenButton: {
    backgroundColor: 'white',
    padding: 5,
    margin: 10,
    borderRadius: 5,
  },
});

export default RegisterCommerceScreen;
