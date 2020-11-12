import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import {GlobalStyles} from '../styles/global.style';
import {useRoute} from '@react-navigation/core';
import {
  Colors,
  CopyClipboard,
  errorMessage,
  http,
} from '../utils/constants.util';
import {Picker} from '@react-native-community/picker';
import store from '../store';
import {showMessage} from 'react-native-flash-message';

const RechargeScreen = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const {global} = store.getState();
  const route = useRoute();
  const [hash, setHash] = useState('');
  const [coin, setCoin] = useState('ALY');
  const [coinName, setCoinName] = useState('Alycoin');
  const [coinList, setCoinList] = useState([]);
  const isMounted = useRef(null);

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

  const _handleSubmit = async () => {
    const {data} = await http.post(
      '/api/ecommerce/wallet/recharge',
      {
        amount: parseFloat(amount),
        amount_usd: parseFloat(amount),
        name_coin: coinName,
        id_wallet: global.wallet_commerce,
        hash,
      },
      {
        headers: {
          'x-auth-token': global.token
        }
      },
    );

    if (data.error) {
      errorMessage(data.message);
    }

    if (data.success) {
      showMessage({
        type: 'success',
        message: 'Alypay E-commerce',
        description: data.message,
      });
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
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('./../assets/img/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.label}>Toca para copiar</Text>
        <TouchableOpacity
          onPress={() => CopyClipboard(route.params.wallet)}
          style={styles.hashContainer}>
          <Text style={styles.hashText}>
            {route.params.wallet.substring(0, 40)}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderWidth: 0.5,
          margin: RFValue(20),
          borderColor: Colors.$colorGray,
        }}
      />
      <View style={{flexDirection: 'row', paddingHorizontal: RFValue(20)}}>
        <View style={{flex: 0.3}}>
          <Text style={styles.label}>Cantidad USD</Text>
          <TextInput
            value={amount}
            onChangeText={(value) => setAmount(value)}
            style={[
              GlobalStyles.textInput,
              {
                paddingVertical: RFValue(3),
                paddingStart: RFValue(15),
              },
            ]}
          />
        </View>
        <View style={{flex: 0.7, paddingLeft: RFValue(10)}}>
          <Text style={styles.label}>Hash de transacción</Text>
          <TextInput
            value={hash}
            onChangeText={(value) => setHash(value)}
            style={[
              GlobalStyles.textInput,
              {
                paddingVertical: RFValue(3),
                paddingStart: RFValue(15),
              },
            ]}
          />
        </View>
      </View>
      <View
        style={{paddingHorizontal: RFValue(20), paddingVertical: RFValue(10)}}>
        <Text style={styles.label}>Moneda</Text>
        <View
          style={{
            borderWidth: 0.4,
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
            onValueChange={(value) => {
              setCoin(value);
              const selectedCoin = coinList.find(
                (item) => item.symbol === value,
              );
              setCoinName(selectedCoin.name);
            }}>
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
            padding: RFValue(12),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: RFValue(15),
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            Confirmar
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
  hashContainer: {
    borderWidth: 1,
    borderColor: Colors.$colorYellow,
    borderRadius: RFValue(50),
    padding: RFValue(10),
    marginVertical: RFValue(5),
  },
  hashText: {
    color: Colors.$colorYellow,
    fontSize: RFValue(15),
    textTransform: 'uppercase',
  },
});

export default RechargeScreen;
