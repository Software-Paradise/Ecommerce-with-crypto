import React, { useState, useEffect, useRef, useReducer } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

// Import components
import Lottie from 'lottie-react-native'
import { RFValue, Colors, GlobalStyles, http, getHeaders, showNotification } from '../../utils/constants.util'
import { View as ViewAnimation, Text as TextAnimation } from 'react-native-animatable'
import { Picker } from '@react-native-community/picker'
import Modal from 'react-native-modal'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'

// Import Assets
import QR from '../../animations/scan-qr.json'

// Import redux store
import store from '../../store'

const initialState = {
    amountFraction: "",
    amountUSD: "",
    walletAdress: "",

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

    const [details, setDetails] = useState(null);
    const isMounted = useRef(null);
    const [coinList, setCoinList] = useState([]);
    const [coin, setCoin] = useState('ALY')
    const [showScanner, setShowScanner] = useState(false)

    const configureComponent = async () => {
        try {

            const coinsResponse = await http.get('https://ardent-medley-272823.appspot.com/collection/prices/minimal')

            const { data } = await http.get(`/api/ecommerce/wallet/details/${global.wallet_commerce}`, getHeaders())

            if (isMounted.current) {
                setDetails(data);
                setCoinList(Object.values(coinsResponse.data));
            }
        } catch (error) {
            showNotification(error.toString())
        } finally {

        }
    }

    const onChangeFractions = (payload = "") => {
        dispatch({ type: "amountFraction", payload })

        const newAmount = coin.price * parseFloat(payload)

        if (parseFloat(payload) > coin.price) {
            throw String("No tienes suficientes fondos")
        }

        dispatch({ type: "amountUSD", payload: isNaN(newAmount) ? "" : newAmount.toString() })
    }

    const onChangeAmount = (payload = '') => {
        dispatch({ type: 'amountUSD', payload })

        const newFraction = (parseFloat(payload) / coin.price).toFixed(8)

        if (newFraction > coin.amount) {
            throw String("No tienes suficientes fondos")
        }

        dispatch({ type: "amountFraction", payload: isNaN(newFraction) ? "" : newFraction.toString() })
    }

    const toggleScan = () => setShowScanner(!showScanner)

    const onReadCodeQR = ({ data }) => {
        toggleScan()

        dispatch({ type: 'walletAdress', payload: data })
    }

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

            <View style={[styles.row, { alignItems: 'center' }]}>
                <TouchableOpacity>
                    <Text style={styles.legend}>RETIRAR FONDOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={GlobalStyles.buttonPrimary}>
                    <Text style={[GlobalStyles.textButton]}>Siguiente</Text>
                </TouchableOpacity>
            </View>

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



})

export default sentComponent