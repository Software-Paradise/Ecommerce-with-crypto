import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import LottieAnimationView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../styles/global.style';
import { Colors, socketAddress } from '../utils/constants.util';
import { RFValue } from 'react-native-responsive-fontsize';
import QRCode from 'react-native-qrcode-svg';
import * as CryptoJS from 'react-native-crypto-js';
import store from '../store';
import socketIO from 'socket.io-client';

const TransactionScreen = ({ navigation }) => {
  const { global } = store.getState();
  const [keySecret, setKeySecret] = useState('');
  const route = useRoute();
  const [transaction, setTransaction] = useState('');
  const [amount, setAmount] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currency, setCurrency] = useState('(USD)');
  const [showModal, setShowModal] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [onSuccessMessage, setOnSuccessMessage] = useState(
    'Pago realizado con éxito',
  );
  const [status, setStatus] = useState('Esperando pago');
  const [connectionSocket, setConnectionSocket] = useState();
  const cypherdata = CryptoJS.AES.encrypt(
    JSON.stringify({
      id: roomId,
      orderId: transaction,
      wallet_commerce: global.wallet_commerce,
      description: global.description,
      amount: route.params.amount,
    }),
    keySecret,
  );

  const handleSuccess = () => {
    setShowModal(!showModal);
    navigation.goBack();
  };

  const handleFail = () => {
    setShowModal(!showModal);
  };

  const cancelButton = () => {
    goBack()
    // connectionSocket.emit('disconnect', 'cancel_transaction');
    connectionSocket.disconnect(true);
  };

  const goBack = () => {
    Alert.alert("Estas a punto de cancelar la transaccion", "Realmente quieres ejecutar esta accion", [
      {
        text: 'Cancelar',
        onPress: () => { }
      },
      {
        text: 'Salir',
        onPress: () => {
          navigation.pop()
        }
      }
    ])
  }

  useEffect(() => {
    const _unsubscribe = navigation.addListener('focus', () => {
      connection();
    });

    setAmount(route.params.amount);

    return _unsubscribe;
  }, [connection, navigation, route.params.amount]);

  const connection = useCallback(() => {
    console.log(
      transaction,
      global.wallet_commerce,
      global.description,
      amount,
    );
    const socket = socketIO(socketAddress, {
      query: {
        token: global.token,
        data: JSON.stringify({
          id: roomId,
          orderId: transaction,
          wallet: global.wallet_commerce,
          description: global.description,
          amount: Number(route.params.amount),
        }),
      },
      forceNew: true,
      transports: ['websocket'],
    });
    // socket.connect();
    setConnectionSocket(socket);

    socket.on('connect', () => {
      console.log('connected');
      socket.send('Im in');
    });

    socket.on('reconnect_attempt', (event) => {
      socket.io.opts.transports = ['websocket'];
      console.log('Reconnect attempt', event);
    });

    socket.on('disconnect', () => {
      console.log('Connection lost');
    });

    socket.on('message', (message) => {
      console.log('Message', message);
      setKeySecret(message.keysecret);
      setRoomId(message.id);
      setTransaction(message.order);

      console.log(
        'On message',
        transaction,
        global.wallet_commerce,
        global.description,
        amount,
      );
    });

    socket.on('status', (response) => {
      console.log('Status', response);
      if (response.error) {
        setShowModal(true);
        setOnSuccess(false);
        setOnSuccessMessage(response.message);
      }

      if (response.success) {
        setShowModal(true);
        setOnSuccess(true);
        setOnSuccessMessage(response.message);
        socket.disconnect();
      }
    });

    socket.on('error', (error) => {
      console.log('Error', error);
    });
  }, [
    amount,
    global.description,
    global.token,
    global.wallet_commerce,
    roomId,
    route.params.amount,
    transaction,
  ]);

  return (
    <SafeAreaView
      style={[
        GlobalStyles.superContainer,
        { justifyContent: 'center', alignItems: 'center' },
      ]}>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={TransactionStyles.modalView}>
          <View
            style={{
              width: 120,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('./../assets/img/logo.png')}
              style={TransactionStyles.logo}
            />
          </View>

          <View>
            <Text
              style={{
                color: Colors.$colorGray,
                fontSize: RFValue(20),
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
              ¡Estupendo!
            </Text>
          </View>

          <View style={TransactionStyles.animationContainer}>
            <LottieAnimationView
              source={
                onSuccess
                  ? require('./../animations/yellow-success.json')
                  : require('./../animations/error_animation.json.json')
              }
              autoPlay
              autoSize
              loop={false}
            />
          </View>

          <Text
            style={[
              TransactionStyles.textAlertStyle,
              { color: onSuccess ? Colors.$colorYellow : Colors.$colorRed },
            ]}>
            {onSuccessMessage}
          </Text>

          {onSuccess ? (
            <TouchableOpacity
              onPress={handleSuccess}
              style={TransactionStyles.handleButton}>
              <Text
                style={{
                  fontSize: RFValue(24),
                  fontWeight: 'bold',
                }}>
                Confirmar
              </Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                onPress={handleFail}
                style={TransactionStyles.handleButton}>
                <Text>Confirmar</Text>
              </TouchableOpacity>
            )}
        </View>
      </Modal>
      <Image
        source={require('./../assets/img/logo.png')}
        style={TransactionStyles.logo}
      />
      <Text style={TransactionStyles.mainTitle}>Procesar transaccion</Text>

      <View style={TransactionStyles.mainContainer}>
        <View style={TransactionStyles.transactionData}>
          <Text
            style={[
              TransactionStyles.mediumText,
              { color: Colors.$colorYellow },
            ]}>
            Numero de orden: {transaction}
          </Text>
          <Text style={TransactionStyles.currencyText}>{currency}</Text>
          <Text style={TransactionStyles.amountText}>
            {parseFloat(route.params.amount).toFixed(2) || 0.0}
          </Text>
        </View>

        <View style={TransactionStyles.qrCodeContainer}>
          <QRCode
            logo={require('./../assets/img/aly-coin.png')}
            size={RFValue(180)}
            backgroundColor={Colors.$colorYellow}
            value={`${cypherdata},${keySecret}`}
          />
        </View>

        <View style={TransactionStyles.statusRow}>
          <Text style={TransactionStyles.statusLabel}>Estado: </Text>
          <Text style={TransactionStyles.status}>{status}</Text>
        </View>

        <View style={TransactionStyles.cancelContainer}>
          <TouchableOpacity style={TransactionStyles.cancelButton}>
            <Text onPress={cancelButton} style={TransactionStyles.cancelText}>
              Cancelar transaccion
            </Text>
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
    alignItems: 'center',
    height: Dimensions.get('window').height - RFValue(180),
    width: Dimensions.get('window').width - RFValue(75),
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
    justifyContent: 'center',
    // marginHorizontal: RFValue(50),
    borderRadius: RFValue(10),
    width: RFValue(210),
    height: RFValue(210),
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
  modalView: {
    margin: 20,
    backgroundColor: Colors.$colorMain,
    borderWidth: 2,
    borderColor: Colors.$colorYellow,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleButton: {
    backgroundColor: Colors.$colorYellow,
    borderRadius: 50,
    marginTop: RFValue(30),
    padding: RFValue(10),
  },
  animationContainer: {
    height: RFValue(150),
    width: RFValue(150),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlertStyle: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
  },
  logo: {
    alignContent: 'center',
    resizeMode: 'contain',
    height: RFValue(128),
    width: RFValue(256),
  },
});

export default TransactionScreen;
