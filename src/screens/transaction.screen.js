import React, {useState, useEffect} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlobalStyles} from '../styles/global.style';
import {Colors, serverAddress, socketAddress} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';
import QRCode from 'react-native-qrcode-svg';
import * as CryptoJS from 'react-native-crypto-js';
import store from '../store';

const TransactionScreen = () => {
  const navigation = useNavigation();
  const {global} = store.getState();
  const route = useRoute();
  const [transaction, setTransaction] = useState({});
  const [currency, setCurrency] = useState('(NIO)');
  const [status, setStatus] = useState('Esperando pago');
  const cypherdata = CryptoJS.AES.encrypt(
    JSON.stringify({id: global.id_commerce, amount: route.params.amount}),
    's3cr3t_k3y',
  );
  const testData = JSON.stringify({
    id: global.id_commerce,
    amount: route.params.amount,
  });

  useEffect(() => {
    const ws = new WebSocket(socketAddress);

    ws.onopen = () => {
      ws.send('Connected from app');
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };
    
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  });

  return (
    <SafeAreaView
      style={[
        GlobalStyles.superContainer,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <Text style={TransactionStyles.mainTitle}>Procesar transaccion</Text>
      <View style={TransactionStyles.mainContainer}>
        <View style={TransactionStyles.transactionData}>
          {/* <Text style={TransactionStyles.mediumText}>
            ID: {transaction.id || 'Undefined'}{' '}
          </Text> */}
          <Text style={TransactionStyles.currencyText}>{currency}</Text>
          <Text style={TransactionStyles.amountText}>
            {parseFloat(route.params.amount).toFixed(2) || 0.0}
          </Text>
        </View>
        <View style={TransactionStyles.qrCodeContainer}>
          <QRCode
            logo={require('./../assets/img/aly-coin.png')}
            size={200}
            backgroundColor={Colors.$colorYellow}
            value={cypherdata + ',s3cr3t_k3y'}
          />
        </View>
        <View style={TransactionStyles.statusRow}>
          <Text style={TransactionStyles.statusLabel}>Estado: </Text>
          <Text style={TransactionStyles.status}>{status}</Text>
        </View>
        <View style={TransactionStyles.cancelContainer}>
          <TouchableOpacity style={TransactionStyles.cancelButton}>
            <Text onPress={() => navigation.navigate('Payment')} style={TransactionStyles.cancelText}>Cancelar transaccion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TransactionStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.$colorBlack,
    borderRadius: RFValue(20),
    height: Dimensions.get('window').height - 200,
    width: Dimensions.get('window').width - 80,
  },
  mainTitle: {
    color: Colors.$colorYellow,
    fontSize: RFValue(18),
    fontWeight: 'bold',
    paddingVertical: RFValue(10),
  },
  qrCodeContainer: {
    backgroundColor: Colors.$colorYellow,
    alignItems: 'center',
    marginHorizontal: RFValue(50),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(10),
  },
  mediumText: {
    color: Colors.$colorGray,
    fontSize: RFValue(18),
    textAlign: 'center',
  },
  currencyText: {
    color: Colors.$colorGray,
    fontSize: RFValue(24),
    textAlign: 'center',
  },
  amountText: {
    color: Colors.$colorGray,
    fontSize: RFValue(26),
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: RFValue(20),
  },
  statusLabel: {
    color: Colors.$colorYellow,
    fontSize: RFValue(16),
  },
  status: {
    color: Colors.$colorGray,
    fontSize: RFValue(16),
  },
  transactionData: {
    paddingVertical: RFValue(20),
  },
  cancelText: {
    color: Colors.$colorRed,
    fontSize: RFValue(14),
    textDecorationLine: 'underline',
  },
  cancelButton: {
    padding: RFValue(10),
  },
  cancelContainer: {
    marginVertical: RFValue(25),
  },
});

export default TransactionScreen;
