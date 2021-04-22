import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

// import components
import Container from '../../components/Container/Container';
import LottieAnimationView from 'lottie-react-native';
import QRCode from 'react-native-qrcode-svg';
import Navbar from '../../components/Navbar/Navbar';

// import constants and functions
import {
  Colors,
  socketAddress,
  RFValue,
  GlobalStyles,
} from '../../utils/constants.util';
import {useRoute} from '@react-navigation/native';
import socketIO from 'socket.io-client';
import * as CryptoJS from 'react-native-crypto-js';

// import redux configurations
import store from '../../store';

// import assets
import logoAlyCoinImage from '../../assets/img/aly-coin.png';
import successAnimation from '../../animations/success.json';
import errorAnimation from '../../animations/error.json';

/**Vista de transaccion (Esperando pago) */
const TransactionScreen = ({navigation}) => {
  const route = useRoute();
  // obtenemos el estado global de redux
  const {global} = store.getState();

  const [keySecret, setKeySecret] = useState('');
  // estado que guarda el numero de orden
  const [transaction, setTransaction] = useState('');

  // estado que guarda el monto facturado
  const [amount, setAmount] = useState('');
  const [roomId, setRoomId] = useState('');

  // Divisa de pago
  const [currency, setCurrency] = useState('(USD)');

  // estado que maneja la presencia de la modal
  const [showModal, setShowModal] = useState(false);

  // estado que indica si hay un siccess
  const [onSuccess, setOnSuccess] = useState(false);

  // mensaje de success
  const [onSuccessMessage, setOnSuccessMessage] = useState('');

  // estado que almacena la instancia de socket
  const [connectionSocket, setConnectionSocket] = useState();

  // ????
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

  // ???
  const handleSuccess = () => {
    setShowModal(!showModal);

    // vamos a una vista anterior
    navigation.goBack();
  };

  // Metodo se ejecuta cuando un usuaro cancela la orden
  const goBack = () => {
    //setShowModal(!showModal)
    Alert.alert(
      'Estas a punto de cancelar la transaccion',
      'Realmente quieres ejecutar esta accion',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
        },
        {
          text: 'Salir',
          onPress: () => {
            connectionSocket.disconnect(true);
            connectionSocket.emit('cancel');
            navigation.pop();
          },
        },
      ],
    );

    return true;
  };

  // Coneccion al socket para hacer el pago al comercio
  const connection = useCallback(() => {
    // instanciamos el nuevo Socket
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

    // Seteamos la instancia de socket en un estado
    setConnectionSocket(socket);

    // ???
    socket.on('reconnect_attempt', (_) => {
      socket.io.opts.transports = ['websocket'];
    });

    socket.on('message', (message) => {
      // seteamos la llave para desencriptar
      setKeySecret(message.keysecret);

      // seteamos el id del socket message
      setRoomId(message.id);

      // seteamos el orden de la transaccion
      setTransaction(message.order);
    });

    socket.on('status', (response) => {
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
  }, [
    amount,
    global.description,
    global.token,
    global.wallet_commerce,
    roomId,
    route.params.amount,
    transaction,
  ]);

  useEffect(() => {
    const backHanldedEvent = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );
    const _unsubscribe = navigation.addListener('focus', () => {
      connection();
    });

    setAmount(route.params.amount);

    return () => {
      _unsubscribe;
      backHanldedEvent.remove();
    };
  }, [connection, navigation, route.params.amount]);

  return (
    <>
      <Container showLogo>
        <View style={styles.statusRow}>
          <Text style={[styles.orderNumber, {color: Colors.$colorYellow}]}>
            Orden #<Text style={{fontWeight: 'bold'}}>{transaction}</Text>
          </Text>
          <Text style={styles.amountText}>
            {parseFloat(route.params.amount).toFixed(2) || 0.0} {currency}
          </Text>
        </View>

        <View style={styles.qrCodeContainer}>
          <QRCode
            backgroundColor={Colors.$colorYellow}
            logo={logoAlyCoinImage}
            size={RFValue(310)}
            value={`${cypherdata},${keySecret}`}
          />
        </View>

        <View style={styles.statusRow}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <View style={styles.waitingPayment}>
            <ActivityIndicator color={Colors.$colorGray} size={RFValue(16)} />
            <Text style={styles.status}>Esperando Pago</Text>
          </View>
        </View>
      </Container>

      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.modalView}>
            <View style={{alignItems: 'center'}}>
              <View style={[styles.row, {alignItems: 'center'}]}>
                <View style={{padding: 20}}>
                  <Text style={styles.title}>
                    {' '}
                    {onSuccess ? '¡Estupendo!' : '¡Error!'}
                  </Text>
                </View>

                <LottieAnimationView
                  style={styles.animation}
                  source={onSuccess ? successAnimation : errorAnimation}
                  autoPlay
                  loop={false}
                />
              </View>
              <Text
                style={[
                  styles.textAlertStyle,
                  {color: onSuccess ? Colors.$colorYellow : Colors.$colorRed},
                ]}>
                {onSuccessMessage}
              </Text>
            </View>

            <View style={{alignItems: 'center', padding: 20}}>
              {onSuccess ? (
                <TouchableOpacity
                  onPress={handleSuccess}
                  style={[
                    GlobalStyles.buttonPrimary,
                    {paddingHorizontal: RFValue(60)},
                  ]}>
                  <Text style={GlobalStyles.textButton}>Confirmar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSuccess}
                  style={[
                    GlobalStyles.buttonPrimary,
                    {paddingHorizontal: RFValue(60)},
                  ]}>
                  <Text style={GlobalStyles.textButton}>Cerrar pago</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Navbar />
    </>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.$colorYellow,
    borderRadius: RFValue(10),
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    padding: 10,
  },

  orderNumber: {
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
    fontSize: RFValue(16),
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: RFValue(20),
    width: '80%',
  },
  status: {
    color: Colors.$colorGray,
    fontSize: RFValue(16),
    marginLeft: 5,
  },
  cancelText: {
    color: Colors.$colorRed,
    fontSize: RFValue(14),
    textDecorationLine: 'underline',
  },
  cancelButton: {
    padding: RFValue(10),
  },
  modalView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$colorBlack,
    borderRadius: 10,
    padding: 10,
    height: '70%',
    width: '85%',
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
  loader: {
    height: RFValue(36),
    width: RFValue(36),
  },
  waitingPayment: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: Colors.$colorGray,
    fontSize: RFValue(24),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
    padding: 10,
  },
  animation: {
    height: RFValue(160),
    width: RFValue(160),
  },
});

export default TransactionScreen;
