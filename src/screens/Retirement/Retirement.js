import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'

import { RFValue, Colors, GlobalStyles, http, errorMessage, serverSpeedtradingsURL, getFeePercentage } from '../../utils/constants.util'

// import components
import Card from '../../components/CardProfile/CardProfile'
import Lottie from 'lottie-react-native'
import Modal from 'react-native-modal'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Picker } from '@react-native-community/picker'
import { View as ViewAnimation } from 'react-native-animatable'

// import constanst and functions
import Axios from 'axios'
import { RNCamera } from 'react-native-camera'
import _ from "lodash"

// import assets and styles
import QR from '../../animations/scan-qr.json'
import Logo from '../../assets/img/logo.png'

// Import redux store
import store from '../../store'
import Container from '../../components/Container/Container'
import { useHasSystemFeature } from 'react-native-device-info'

const Retirements = () => {
    const { global } = store.getState();

    const [amountSatochi, setTotalAmountSatochi] = useState(0)
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [coinIndexSelected, setCoin] = useState(0);
    const [coinList, setCoinList] = useState([]);
    // estado que guarda el fee de la transaccion
    const [fee, setFee] = useState("0")

    const isMounted = useRef(null);
    const toggleScan = () => setShowScanner(!showScanner);

    ///?????
    const onReadCodeQR = ({ data }) => {
        toggleScan();
        setWalletAddress(data);
    };

    // ????
    const _handleSubmit = async () => {
        const { data } = await http.post(
            '/api/ecommerce/wallet/retirement',
            {
                wallet: walletAddress,
                id_wallet: global.wallet_commerce,
                amount: parseFloat(amount),
                symbol: coinList[coinIndexSelected].symbol,
            },
            {
                headers: {
                    'x-auth-token': global.token,
                },
            },
        );

        // verificamos si hay algun error
        if (data.error) {
            errorMessage(data.message);
        }

        showMessage({
            type: 'success',
            message: 'Alypay E-commerce',
            description: 'Tu petición esta en proceso',
        });

        // retornamos a la vista anterios
        navigation.pop();
    };

    // metodo que se ejecuta cuando se carga la vista
    const ConfigureComponent = async () => {
        try {

            // obtenemos los precios de las monedas principales
            const { data } = await Axios.get(`${serverSpeedtradingsURL}/collection/prices/minimal`);

            // convertimos el objeto en array
            const arrayCoins = Object.values(data)

            setCoinList(arrayCoins)
        } catch (e) {
            errorMessage(e.message);
        }
    }

    const onChangeAmount = str => {
        setAmount(str)

        // obtenemos el fee
        const { fee } = getFeePercentage(str, 2, global.fee)

        setFee(fee * str)
    }

    useEffect(() => {
        isMounted.current = true;
        ConfigureComponent();
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (amount.trim()) {

            // total de dolares escritos por el usuario
            const totalAmount = parseFloat(amount)

            const { price } = coinList[coinIndexSelected].quote.USD


            const satochiNakamotoXD = (totalAmount / price)

            setTotalAmountSatochi(_.floor(satochiNakamotoXD, 8))
        } else {
            setTotalAmountSatochi(0)
        }
    }, [amount, coinIndexSelected])


    return (
        <Container showLogo>
            <ViewAnimation style={styles.container} animation='fadeIn'>

                <Card />

                <View style={styles.containerTitle}>
                    <Text style={styles.legendTitle}>Retirar Fondos</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.legend}>Dirección de billetera externa</Text>

                        <View style={styles.rowInput}>
                            <TextInput
                                style={[GlobalStyles.textInput, { flex: 1 }]}
                                value={walletAddress}
                                onChangeText={setWalletAddress}
                                returnKeyLabel="next"
                            />

                            <TouchableOpacity onPress={toggleScan} style={styles.buttonScan}>
                                <Lottie source={QR} style={styles.lottieQRAnimation} autoPlay loop />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.colSelectionCoin}>
                        <Text style={styles.legend}>Moneda</Text>

                        <View style={GlobalStyles.containerPicker}>
                            <Picker style={GlobalStyles.picker}
                                selectedValue={coinIndexSelected}
                                itemStyle={{ height: RFValue(35), backgroundColor: "transparent" }}
                                onValueChange={(value) => setCoin(value)}>
                                {
                                    coinList.map((item, index) => (
                                        <Picker.Item enabled={true} key={index} label={item.symbol} value={index} color={Colors.$colorYellow} />))
                                }
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.legend}>Monto a retirar (USD)</Text>

                        <View style={styles.rowInput}>
                            <TextInput
                                style={[GlobalStyles.textInput, { flex: 1 }]}
                                value={amount}
                                onChangeText={onChangeAmount}
                                keyboardType="numeric"
                                placeholderTextColor={Colors.$colorGray}
                                placeholder="0.00 (USD)"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.col}>
                    <Text style={styles.totalSatochi}>
                        {amountSatochi} {coinList[coinIndexSelected]?.symbol}
                    </Text>

                    <Text style={styles.totalSatochiFee}>
                        Fee {_.floor((fee / coinList[coinIndexSelected].quote.USD.price), 8)} {coinList[coinIndexSelected]?.symbol}
                    </Text>
                </View>

                <View style={{ padding: 15 }}>
                    <TouchableOpacity onPress={_handleSubmit} style={GlobalStyles.buttonPrimary}>
                        <Text style={GlobalStyles.textButton}>Retirar fondos</Text>
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
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: RFValue(10),
    },

    col: {
        flex: 1,
        marginHorizontal: RFValue(10),
    },

    colSelectionCoin: {
        // flex: 1,
        width: "30%",
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
        position: "relative",
        alignItems: "center",
        flexDirection: "row"
    },

    buttonScan: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(5),
        // padding: RFValue(-),
        marginLeft: RFValue(10),
        zIndex: 1000,
    },

    lottieQRAnimation: {
        height: RFValue(40),
        width: RFValue(35),
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
    logo: {
        alignSelf: "center",
        // backgroundColor: 'red',
        resizeMode: 'contain',
        height: RFValue(160),
        width: RFValue(380),
    },
    totalSatochi: {
        alignSelf: "center",
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
        marginVertical: RFValue(10),
    },
    totalSatochiFee: {
        alignSelf: "center",
        color: Colors.$colorYellow,
        fontSize: RFValue(12),
        marginVertical: RFValue(10),
    },
    containerTitle: {
        marginTop: RFValue(10),
        flexDirection: "row",
        justifyContent: "center"
    },
    legendTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
        textTransform: 'uppercase',
        marginBottom: 10
    },
})

export default Retirements
