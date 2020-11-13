import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import {Colors, errorMessage, http} from '../utils/constants.util';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {Picker} from '@react-native-community/picker';
import store from '../store';
import {showMessage} from 'react-native-flash-message';

const RetirementsScreen = ({navigation}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const {global} = store.getState();
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [coin, setCoin] = useState('ALY');
  const [coinList, setCoinList] = useState([]);
  const isMounted = useRef(null);
  const toggleScan = () => setShowScanner(!showScanner);
  const onReadCodeQR = ({data}) => {
    toggleScan();
    setWalletAddress(data);
  };

  const _handleSubmit = async () => {
    const {data} = await http.post(
      '/api/ecommerce/wallet/retirement',
      {
        wallet: walletAddress,
        id_wallet: global.wallet_commerce,
        amount: parseFloat(amount),
        symbol: coin,
      },
      {
        headers: {
          'x-auth-token': global.token,
        },
      },
    );
    console.log(data);
    if (data.error) {
      errorMessage(data.message);
    }

    if (data.response === 'success') {
      showMessage({
        type: 'success',
        message: 'Alypay E-commerce',
        description: 'Tu petición esta siendo procesada',
      });
      navigation.pop();
    }
  };

  const ConfigureComponent = async () => {
    try {
      const coinsResponse = await http.get(
        'https://ardent-medley-272823.appspot.com/collection/prices/minimal',
      );
      if (isMounted.current) {
        setCoinList(Object.values(coinsResponse.data));
      }
    } catch (e) {
      errorMessage(e.message);
    } finally {
      if (isMounted.current) {
        console.log('Coins', coinList[0]);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    ConfigureComponent();
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
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
      <View style={{alignItems: 'center', padding: RFValue(30)}}>
        <Text
          style={{
            fontSize: RFValue(18),
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: Colors.$colorYellow,
          }}>
          Retiro de fondos
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: RFValue(20),
        }}>
        <View style={{flex: 0.8}}>
          <Text style={styles.label}>Dirección de billetera externa</Text>
          <TextInput
            value={walletAddress}
            onChangeText={(value) => setWalletAddress(value)}
            style={[
              GlobalStyles.textInput,
              {
                paddingVertical: RFValue(5),
              },
            ]}
          />
        </View>
        <View
          style={{
            flex: 0.2,
            marginBottom: RFValue(4),
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={toggleScan}
            style={{
              backgroundColor: Colors.$colorYellow,
              borderRadius: RFValue(50),
              padding: RFValue(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcon
              name="qrcode-scan"
              size={RFValue(20)}
              color={Colors.$colorBlack}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          padding: RFValue(20),
        }}>
        <Text style={styles.label}>Monto a retirar</Text>
        <TextInput
          value={amount}
          keyboardType='numeric'
          onChangeText={(value) => setAmount(value)}
          style={[
            GlobalStyles.textInput,
            {
              paddingVertical: RFValue(4),
            },
          ]}
        />
      </View>
      <View style={{paddingHorizontal: RFValue(20)}}>
        <Text style={styles.label}>Moneda</Text>
        <View
          style={{
            borderWidth: 1,
            borderRadius: RFValue(50),
            backgroundColor: Colors.$colorBlack,
            borderColor: Colors.$colorYellow,
          }}>
          <Picker
            style={{
              borderColor: Colors.$colorYellow,
              color: 'white',
              height: RFValue(40),
              fontSize: RFValue(10),
            }}
            prompt="Seleccione una moneda"
            mode="dialog"
            selectedValue={coin}
            onValueChange={(value) => setCoin(value)}>
            {coinList.map((item, index) => (
              <Picker.Item
                enabled={true}
                key={index}
                label={item.name}
                value={item.symbol}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View
        style={{
          padding: RFValue(20),
        }}>
        <TouchableOpacity
          onPress={_handleSubmit}
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
              fontSize: RFValue(16),
              fontWeight: 'bold',
            }}>
            Retirar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignContent: 'center',
    resizeMode: 'contain',
    height: RFValue(128),
    width: RFValue(256),
  },
  label: {
    color: Colors.$colorYellow,
    fontSize: RFValue(12),
  },
  containerQR: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(5),
    height: RFValue(320),
    overflow: 'hidden',
  },
});
export default RetirementsScreen;
