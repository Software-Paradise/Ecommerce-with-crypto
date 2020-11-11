import React, {useState, useEffect, useRef} from 'react';
import {
  KeyboardAvoidingView,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import PaymentScreen from './payment.screen';
import HistoryScreen from './history.screen';
import {
  errorMessage,
  http,
  switchItems,
  TYPE_VIEW,
} from '../utils/constants.util';
import Switch from '../components/switch.component';
import {Colors} from './../utils/constants.util';
import QRCode from 'react-native-qrcode-svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {registerStyles} from './register.screen';
import {GlobalStyles} from '../styles/global.style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../store';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Modal from 'react-native-modal';

// const Drawer = createDrawerNavigator();

const MainScreen = ({navigation}) => {
  const [stateView, setStateView] = useState(TYPE_VIEW.ORDER);
  const {global} = store.getState();
  const [details, setDetails] = useState(null);
  const isMounted = useRef(null);

  const [walletAddress, setWalletAddress] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const toggleScan = () => setShowScanner(!showScanner);
  const onReadCodeQR = ({data}) => {
    toggleScan();
    setWalletAddress(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ConfigureComponent = async () => {
    try {
      const {data} = await http.get(
        `/api/ecommerce/wallet/details/${global.wallet_commerce}`,
        {
          headers: {
            'x-auth-token': global.token,
          },
        },
      );
      if (isMounted.current) {
        setDetails(data);
      }
    } catch (e) {
      errorMessage(e.message);
    } finally {
      console.log('Wallet address: ', details.wallet);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    ConfigureComponent();

    return () => {
      isMounted.current = false;
    };
  }, [global]);

  return (
    <View style={styles.container}>
      <Modal
        backdropOpacity={0.9}
        animationIn="fadeIn"
        onBackButtonPress={toggleScan}
        onBackdropPress={toggleScan}
        animationOut="fadeOut"
        isVisible={showScanner}>
        <View style={styles.containerQR}>
          <QRCodeScanner
            onRead={onReadCodeQR}
            flashMode={RNCamera.Constants.FlashMode.auto}
          />
        </View>
      </Modal>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('./../assets/img/logo.png')}
          style={styles.logo}
        />
      </View>

      <Switch onSwitch={setStateView} items={switchItems} />
      <KeyboardAvoidingView enabled behavior="padding">
        {stateView === TYPE_VIEW.PAY && <PaymentScreen />}

        {stateView === TYPE_VIEW.RECEIVE && (
          <View style={{alignItems: 'center'}}>
            <View style={styles.qrContainer}>
              <QRCode
                logo={require('./../assets/img/aly-coin.png')}
                size={RFValue(300)}
                backgroundColor={Colors.$colorYellow}
                value={details.wallet}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.$colorYellow,
                  padding: RFValue(18),
                  borderRadius: RFValue(50),
                  marginRight: RFValue(10),
                }}>
                <FeatherIcon
                  name="copy"
                  size={RFValue(22)}
                  color={Colors.$colorBlack}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Recharge', {
                  wallet: details.wallet,
                })}
                style={{
                  backgroundColor: Colors.$colorYellow,
                  padding: RFValue(15),
                  borderRadius: RFValue(50),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5Icon
                  style={{marginRight: RFValue(5)}}
                  name="hand-holding-usd"
                  size={RFValue(20)}
                  color={Colors.$colorBlack}
                />
                <Text
                  style={{
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}>
                  Recargar billetera
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {stateView === TYPE_VIEW.SEND && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  padding: RFValue(10),
                  flex: 0.9,
                }}>
                <Text style={registerStyles.inputLabel}>
                  Dirección de billetera
                </Text>
                <TextInput
                  style={[
                    GlobalStyles.textInput,
                    {
                      paddingVertical: RFValue(5),
                      paddingHorizontal: RFValue(10),
                      margin: RFValue(5),
                    },
                  ]}
                  placeholder="Hash de billetera"
                  placeholderTextColor={Colors.$colorGray}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flex: 0.2,
                }}>
                <TouchableOpacity
                  onPress={toggleScan}
                  style={{
                    backgroundColor: Colors.$colorYellow,
                    padding: RFValue(15),
                    marginBottom: RFValue(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RFValue(50),
                  }}>
                  <MaterialCommunityIcons
                    color={Colors.$colorBlack}
                    size={RFValue(22)}
                    name="qrcode-scan"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                padding: RFValue(10),
              }}>
              <Text style={registerStyles.inputLabel}>Monto (USD)</Text>
              <TextInput
                style={[
                  GlobalStyles.textInput,
                  {
                    padding: RFValue(5),
                    margin: RFValue(5),
                  },
                ]}
                placeholder="Monto"
                placeholderTextColor={Colors.$colorGray}
              />
            </View>
            <View style={{padding: RFValue(10)}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.$colorYellow,
                  borderRadius: RFValue(50),
                  padding: RFValue(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: RFValue(18),
                  }}>
                  Siguiente
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                padding: RFValue(10),
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Retirements', {
                  wallet: details.wallet,
                })}
                style={{
                  padding: RFValue(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.$colorYellow,
                    fontSize: RFValue(18),
                    textTransform: 'uppercase',
                  }}>
                  Retirar fondos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {stateView === TYPE_VIEW.HISTORY && <HistoryScreen />}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.$colorMain,
  },
  qrContainer: {
    width: RFValue(320),
    height: RFValue(320),
    backgroundColor: Colors.$colorYellow,
    borderRadius: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: RFValue(30),
  },
  logo: {
    alignContent: 'center',
    resizeMode: 'contain',
    height: RFValue(128),
    width: RFValue(256),
  },
  containerQR: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(5),
    height: RFValue(320),
    overflow: 'hidden',
  },
});

export default MainScreen;
