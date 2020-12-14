import React, { useState, useEffect, useRef, useReducer } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from "@react-navigation/native"

// Import components
import Lottie from 'lottie-react-native'
import { RFValue, Colors, GlobalStyles, http, getHeaders, showNotification, errorMessage, successMessage } from '../../utils/constants.util'
import { View as ViewAnimation, Text as TextAnimation } from 'react-native-animatable'
import { Picker } from '@react-native-community/picker'
import Modal from 'react-native-modal'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'

// Import Assets
import QR from '../../animations/scan-qr.json'
import profileVerifedAnimation from '../../animations/profile-verifed.json'
import defaultAvatar from '../../assets/img/profile-default.png'

// Import redux store
import store from '../../store'



const initialState = {
    amountFraction: "",
    amountUSD: "",
    walletAdress: "",

    dataWallet: null,
    walletAccepted: false,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const sentComponent = () => {
    const { global } = store.getState()

    const [state, dispatch] = useReducer(reducer, initialState)
    const { navigate } = useNavigation()

    const [details, setDetails] = useState(null);
    const isMounted = useRef(null);
    const [coinList, setCoinList] = useState([]);
    const [coin, setCoin] = useState('ALY')
    const [showScanner, setShowScanner] = useState(false)

    const submit = async () => {
        try {

            if (state.amountUSD.trim().length === 0) {
                throw String("Ingrese un monto")
            }

            const dataSent = {
                amount_usd: state.amountUSD,
                amount: state.amountFraction,
                wallet: state.walletAdress,
                id_wallet: global.wallet_commerce,
                symbol: coin,
            }


            const { data } = await http.post('/api/ecommerce/wallet/transaction', dataSent, getHeaders())


            if (data.error) {
                errorMessage(data.message)
            }

            if (data === 'success') {
                successMessage("Tu transaccion se ha completado")

                // limpiamos el monto en usd
                dispatch({ type: "amountUSD", payload: "" })

                // limpiamos las fracciones de las moneda
                dispatch({ type: "amountFraction", payload: "" })

                // Limpiamos el usuario remitente
                dispatch({ type: "dataWallet", payload: "" })

                // limpiamos la direccion de wallet
                dispatch({ type: "walletAdress", payload: "" })
                dispatch({ type: "walletAccepted", payload: false })
            } else {
                throw String("Tu transacción no se ha compeltado, contacte a soporte")
            }
        } catch (error) {
            errorMessage(error.toString())
        }
    }

    const configureComponent = async () => {
        try {

            const coinsResponse = await http.get('https://ardent-medley-272823.appspot.com/collection/prices/minimal')

            const { data } = await http.get(`/api/ecommerce/wallet/details/${global.wallet_commerce}`, getHeaders())

            if (isMounted.current) {
                setDetails(data.information)
                setCoinList(Object.values(coinsResponse.data));
            }
        } catch (error) {
            showNotification(error.toString())
        } finally {

        }
    }

    const onComprobateWallet = async () => {
        try {

            if (state.walletAdress.length < 90) {
                throw String("Dirección de billetera incorrecta")
            }

            // get data wallet
            const { data } = await http.get(`/api/ecommerce/wallet/verify/${state.walletAdress}`, getHeaders())

            if (data.error) {
                throw String("Billetera no encontrada, intente nuevamente")
            }

            // // Verificamos si la billetera es la misman
            // if (data.id === data.id) {
            //     throw String("Billetera incorrecta")
            // }

            // // Verificamos si la billetera son del mismo tipo
            // if (data.symbol !== data.symbol) {
            //     throw String(`Esta billetera no es de ${data.description}`)
            // }

            dispatch({ type: "dataWallet", payload: data })

            dispatch({ type: "walletAccepted", payload: true })

        } catch (error) {
            errorMessage(error.toString())

            // wallert is not accepted
            dispatch({ type: "walletAccepted", payload: false })

            // clear data if is necesary
            dispatch({ type: "dataWallet", payload: null })
        }
    }
    const onChangeFractions = (payload = "") => {
        dispatch({ type: "amountFraction", payload })

        const _coin = coinList.filter(item => item.symbol === coin)[0]

        const newAmount = _coin.quote.USD.price * parseFloat(payload)

        if (parseFloat(payload) > details.amount) {
            throw String("No tienes suficientes fondos")
        }

        dispatch({ type: "amountUSD", payload: isNaN(newAmount) ? "" : newAmount.toString() })
    }

    const onChangeAmount = (payload = '') => {
        dispatch({ type: 'amountUSD', payload })

        const _coin = coinList.filter(item => item.symbol === coin)[0]

        const newFraction = (parseFloat(payload) / _coin.quote.USD.price).toFixed(8)

        if (newFraction > details.amount) {
            throw String("No tienes suficientes fondos")
        }

        dispatch({ type: "amountFraction", payload: isNaN(newFraction) ? "" : newFraction.toString() })
    }

    const onRetirement = () => {
        navigate("Retirements", { wallet: details.wallet })
    }
    const onReadCodeQR = ({ data }) => {
        toggleScan()

        dispatch({ type: 'walletAdress', payload: data })
    }
    const toggleScan = () => setShowScanner(!showScanner)


    useEffect(() => {
        isMounted.current = true
        configureComponent()

        return () => {
            isMounted.current = false
        }
    }, [global])

    return (
        <ViewAnimation style={styles.container} animation='fadeIn'>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Dirección de billetera</Text>

                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            alue={state.walletAdress}
                            onChangeText={payload => dispatch({ type: "walletAdress", payload })}
                        />

                        <TouchableOpacity onPress={toggleScan} style={styles.buttonScan}>
                            <Lottie source={QR} style={styles.lottieQRAnimation} autoPlay loop />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Moneda</Text>

                    <View style={GlobalStyles.containerPicker}>
                        <Picker
                            style={GlobalStyles.picker}
                            selectedValue={coin}
                            onValueChange={(value) => setCoin(value)}>
                            {
                                coinList.map((item, index) => (
                                    <Picker.Item enabled={true} key={index} label={item.name} value={item.symbol} />
                                ))
                            }
                        </Picker>
                    </View>


                </View>
                <View style={styles.col}>
                    <Text style={styles.legend}>Monto ({coin})</Text>

                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            value={state.amountFraction}
                            onChangeText={onChangeFractions}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Mondo (USD)</Text>

                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            value={state.amountUSD}
                            onChangeText={onChangeAmount}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>
                </View>
            </View>

            <View style={{ height: RFValue(5) }} />

            {
                (state.walletAccepted && state.dataWallet !== null) &&
                <ViewAnimation animation="fadeIn" style={styles.cardInfo}>
                    <View style={styles.subCard}>
                        <Image style={styles.avatar} source={defaultAvatar} />

                        <View>
                            <Text style={styles.usernameCard}>@{state.dataWallet.username}</Text>
                            <Text style={styles.textFromCard}>{state.dataWallet.city}</Text>
                        </View>
                    </View>


                    <Lottie source={profileVerifedAnimation} style={styles.lottieVerifed} autoPlay />
                </ViewAnimation>
            }

            {
                !state.walletAccepted &&
                <View style={styles.retirementContainer}>
                    <TouchableOpacity onPress={onRetirement}>
                        <Text style={styles.retirementText}>Retirar fondos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onComprobateWallet} style={[GlobalStyles.buttonPrimary, { flex: 1, marginLeft: 25 }]}>
                        <Text style={GlobalStyles.textButton}>siguiente</Text>
                    </TouchableOpacity>
                </View>
            }

            {
                state.walletAccepted &&
                <TouchableOpacity onPress={submit} style={GlobalStyles.buttonPrimary}>
                    <Text style={GlobalStyles.textButton}>Enviar</Text>
                </TouchableOpacity>
            }


            <Modal backdropOpacity={0.9} animationIn='fadeIn' onBackButtonPress={toggleScan} onBackdropPress={toggleScan} animationOut='fadeOut' isVisible={showScanner} >
                <View style={styles.constainerQR}>
                    <QRCodeScanner
                        onRead={onReadCodeQR}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                    />
                </View>
            </Modal>
        </ViewAnimation>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: RFValue(10),
    },

    col: {
        flex: 1,
        marginHorizontal: RFValue(10),
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: RFValue(10)
    },

    legend: {
        color: Colors.$colorYellow
    },

    rowInput: {
        alignItems: "center",
        flexDirection: "row"
    },

    buttonScan: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(5),
        padding: RFValue(5),
        marginLeft: RFValue(10),
        zIndex: 1000,
    },

    lottieQRAnimation: {
        height: RFValue(50),
        width: RFValue(50),
    },
    constainerQR: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RFValue(5),
        height: RFValue(320),
        overflow: "hidden",
    },
    retirementText: {
        fontSize: RFValue(16),
        color: Colors.$colorYellow,
        textDecorationLine: "underline",
        textDecorationColor: Colors.$colorYellow,
        textDecorationStyle: "double",
        paddingBottom: 5,
        textTransform: "uppercase",
    },
    retirementContainer: {
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginHorizontal: RFValue(10),
    },
    cardInfo: {
        alignItems: "center",
        backgroundColor: Colors.$colorGreen,
        justifyContent: "space-between",
        padding: RFValue(10),
        borderRadius: RFValue(10),
        marginVertical: RFValue(25),
        elevation: 25,
        flexDirection: "row",
    },
    subCard: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
    },
    avatar: {
        resizeMode: "contain",
        overflow: "hidden",
        width: RFValue(64),
        height: RFValue(64),
        marginRight: RFValue(15),
    },
    usernameCard: {
        fontSize: RFValue(16),
        color: Colors.$colorYellow,
    },
    textFromCard: {
        fontSize: RFValue(12),
        color: "#FFF",
    },
    lottieVerifed: {
        height: RFValue(32),
        width: RFValue(32),
    },
})

export default sentComponent