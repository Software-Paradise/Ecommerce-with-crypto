import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native'

// import components
import Container from '../../components/Container/Container'
import LottieAnimationView from 'lottie-react-native'
import QRCode from 'react-native-qrcode-svg'
import Navbar from "../../components/Navbar/Navbar"

// import constants and functions
import { Colors, socketAddress, RFValue } from '../../utils/constants.util'
import { useRoute } from '@react-navigation/native'
import socketIO from 'socket.io-client'
import * as CryptoJS from 'react-native-crypto-js'

// import redux configurations
import store from '../../store'

// import assets
import logoImage from "../../assets/img/logo.png"
import logoAlyCoinImage from "../../assets/img/aly-coin.png"
import successAnimation from "../../animations/yellow-success.json"
import errorAnimation from "../../animations/error_animation.json.json"

/**Vista de transaccion (Esperando pago) */
const TransactionScreen = ({ navigation }) => {

    const route = useRoute()
    // obtenemos el estado global de redux
    const { global } = store.getState()

    const [keySecret, setKeySecret] = useState('')
    // estado que guarda el numero de orden
    const [transaction, setTransaction] = useState('')

    // estado que guarda el monto facturado
    const [amount, setAmount] = useState('')
    const [roomId, setRoomId] = useState('')

    // Divisa de pago
    const [currency, setCurrency] = useState('(USD)')

    // estado que maneja la presencia de la modal
    const [showModal, setShowModal] = useState(false)

    // estado que indica si hay un siccess
    const [onSuccess, setOnSuccess] = useState(false)

    // mensaje de success
    const [onSuccessMessage, setOnSuccessMessage] = useState('Pago realizado con éxito')

    // estado que almacena la instancia de socket
    const [connectionSocket, setConnectionSocket] = useState()

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
    )

    // ???
    const handleSuccess = () => {
        setShowModal(!showModal)

        // vamos a una vista anterior
        navigation.goBack()
    }

    // Metodo se ejecuta cuando un usuaro cancela la orden
    const goBack = () => {
        Alert.alert("Estas a punto de cancelar la transaccion", "Realmente quieres ejecutar esta accion", [
            {
                text: 'Cancelar',
                onPress: () => { }
            },
            {
                text: 'Salir',
                onPress: () => {
                    connectionSocket.disconnect(true)
                    navigation.pop()
                }
            }
        ])

        return true
    }

    useEffect(() => {
        const backHanldedEvent = BackHandler.addEventListener("hardwareBackPress", goBack)

        return backHanldedEvent.remove()
    }, [])

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            connection()
        })

        setAmount(route.params.amount)

        return _unsubscribe
    }, [connection, navigation, route.params.amount])

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
        })


        // Seteamos la instancia de socket en un estado
        setConnectionSocket(socket)

        // ???
        socket.on('reconnect_attempt', _ => {
            socket.io.opts.transports = ['websocket']
        })

        socket.on('message', (message) => {
            // seteamos la llave para desencriptar
            setKeySecret(message.keysecret)

            // seteamos el id del socket message
            setRoomId(message.id)

            // seteamos el orden de la transaccion
            setTransaction(message.order)
        })

        socket.on('status', (response) => {
            if (response.error) {
                setShowModal(true)
                setOnSuccess(false)
                setOnSuccessMessage(response.message)
            }

            if (response.success) {
                setShowModal(true)
                setOnSuccess(true)
                setOnSuccessMessage(response.message)
                socket.disconnect()
            }
        })
    }, [
        amount,
        global.description,
        global.token,
        global.wallet_commerce,
        roomId,
        route.params.amount,
        transaction,
    ])

    return (
        <>
            <Container showLogo>
                <View style={TransactionStyles.statusRow}>
                    <Text style={[TransactionStyles.orderNumber, { color: Colors.$colorYellow }]}>
                        Orden #<Text style={{ fontWeight: "bold" }}>{transaction}</Text>
                    </Text>

                    <Text style={TransactionStyles.amountText}>
                        {parseFloat(route.params.amount).toFixed(2) || 0.0} {currency}
                    </Text>
                </View>

                <View style={TransactionStyles.qrCodeContainer}>
                    <QRCode
                        backgroundColor={Colors.$colorYellow}
                        logo={logoAlyCoinImage}
                        size={RFValue(310)}
                        value={`${cypherdata},${keySecret}`} />
                </View>

                <View style={TransactionStyles.statusRow}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={TransactionStyles.cancelText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>

                    <View style={TransactionStyles.waitingPayment}>
                        <ActivityIndicator color={Colors.$colorGray} size={RFValue(16)} />
                        <Text style={TransactionStyles.status}>Esperando Pago</Text>
                    </View>
                </View>

                <Modal animationType="slide" transparent={true} visible={showModal}>
                    <View style={TransactionStyles.modalView}>
                        <View
                            style={{
                                width: 120,
                                height: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Image source={logoImage} style={TransactionStyles.logo} />
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
                                source={onSuccess ? successAnimation : errorAnimation}
                                autoPlay
                                autoSize
                                loop={false}
                            />
                        </View>

                        <Text
                            style={[TransactionStyles.textAlertStyle, { color: onSuccess ? Colors.$colorYellow : Colors.$colorRed }]}>
                            {onSuccessMessage}
                        </Text>

                        {
                            onSuccess
                                ?
                                <TouchableOpacity onPress={handleSuccess} style={TransactionStyles.handleButton}>
                                    <Text style={{ fontSize: RFValue(24), fontWeight: 'bold' }}>
                                        Confirmar
                                    </Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={_ => setShowModal(!showModal)} style={TransactionStyles.handleButton}>
                                    <Text>Confirmar</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </Modal>
            </Container>

            <Navbar />
        </>
    )
}

const TransactionStyles = StyleSheet.create({
    qrCodeContainer: {
        alignSelf: 'center',
        alignItems: "center",
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(10),
        borderWidth: 10,
        borderColor: "rgba(255, 255, 255, 0.2)",
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
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: RFValue(20),
        width: "80%",
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
    loader: {
        height: RFValue(36),
        width: RFValue(36),
    },
    waitingPayment: {
        alignItems: "center",
        flexDirection: "row",
    }
})

export default TransactionScreen