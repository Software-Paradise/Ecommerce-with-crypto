import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LottieAnimationView from 'lottie-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlobalStyles} from '../styles/global.style';
import {Colors, socketAddress} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';
import QRCode from 'react-native-qrcode-svg';
import * as CryptoJS from 'react-native-crypto-js';
import store from '../store';
import socketIO from 'socket.io-client';

const TransactionScreen = () => {
  const navigation = useNavigation();
  const {global} = store.getState();
  const [keySecret, setKeySecret] = useState('');
  const route = useRoute();
  const [transaction, setTransaction] = useState({});
  const [roomId, setRoomId] = useState('');
  const [currency, setCurrency] = useState('(USD)');
  const [showModal, setShowModal] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [onSuccessMessage, setOnSuccessMessage] = useState('El pago se ha realizado con exito.');
  const [status, setStatus] = useState('Esperando pago');
  console.log(roomId);
  const cypherdata = CryptoJS.AES.encrypt(
    JSON.stringify({
      id: roomId,
      wallet_commerce: global.wallet_commerce,
      description: global.description,
      amount: route.params.amount,
    }),
    keySecret,
  );

  const handleSuccess = () => {
    setShowModal(!showModal);
    navigation.navigate.pop();
  };

  const handleFail = () => {
    setShowModal(!showModal);
  }

  useEffect(() => {
    connection();
  }, []);

  const connection = useCallback(() => {
    const socket = socketIO(socketAddress, {
      query: {
        'token': global.token,
      },
    });

    socket.connect();

    socket.on('connect', () => {
      const {commerceId} = global.id_commerce;
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('Connection lost');
    });

    socket.on('message', (message) => {
      console.log(message);
      setKeySecret(message.keysecret);
      setRoomId(message.id);
      // store.dispatch({type: 'SETSTATUS', payload: message});
    });

    socket.on('status', (response) => {
      console.log(response);
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

  }, [global.id_commerce, global.token]);

  return (
    <SafeAreaView
      style={[
        GlobalStyles.superContainer,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={TransactionStyles.modalView}>
          <LottieAnimationView
            source={
              onSuccess
                ? require('./../animations/success_animation.json.json')
                : require('./../animations/error_animation.json.json')
            }
            autoPlay
          />

          <Text>{onSuccessMessage}</Text>

            { onSuccess ? <TouchableOpacity onPress={handleSuccess} style={TransactionStyles.handleButton}>
            <Text>Confirmar</Text>
          </TouchableOpacity> : <TouchableOpacity onPress={handleFail} style={TransactionStyles.handleButton}>
            <Text>Confirmar</Text>
          </TouchableOpacity>  }
          

        </View>
        
      </Modal>  
      <Text style={TransactionStyles.mainTitle}>Procesar transaccion</Text>
      <View style={TransactionStyles.mainContainer}>
        <View style={TransactionStyles.transactionData}>
          <Text style={TransactionStyles.mediumText}>
            ID: {showModal ? 'true' : 'false'}
          </Text>
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
            value={`${cypherdata},${keySecret}`}
          />
        </View>
        <View style={TransactionStyles.statusRow}>
          <Text style={TransactionStyles.statusLabel}>Estado: </Text>
          <Text style={TransactionStyles.status}>{status}</Text>
        </View>
        <View style={TransactionStyles.cancelContainer}>
          <TouchableOpacity style={TransactionStyles.cancelButton}>
            <Text onPress={navigation.navigate.pop} style={TransactionStyles.cancelText}>Cancelar transaccion</Text>
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    padding: 10,
  },
});

export default TransactionScreen;
