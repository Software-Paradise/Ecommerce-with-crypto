import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'

import { RFValue, Colors, GlobalStyles, http, errorMessage } from '../../utils/constants.util'
import { View as ViewAnimation } from 'react-native-animatable'
import Lottie from 'lottie-react-native'
import Modal from 'react-native-modal'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { Picker } from '@react-native-community/picker'

import QR from '../../animations/scan-qr.json'
import Logo from '../../assets/img/logo.png'
// Import redux store
import store from '../../store'
const Retirements = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const { global } = store.getState();
    const [amount, setAmount] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [coin, setCoin] = useState('ALY');
    const [coinList, setCoinList] = useState([]);
    const isMounted = useRef(null);
    const toggleScan = () => setShowScanner(!showScanner);
    
    ///?????
    const onReadCodeQR = ({ data }) => {
        toggleScan();
        setWalletAddress(data);
    };

    const _handleSubmit = async () => {
        const { data } = await http.post(
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
        <ViewAnimation style={styles.container} animation='fadeIn'>
            <Image source={Logo} style={styles.logo} />

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Dirección de billetera</Text>

                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            value={walletAddress}
                            onChangeText={setWalletAddress}
                        />

                        <TouchableOpacity onPress={toggleScan} style={styles.buttonScan}>
                            <Lottie source={QR} style={styles.lottieQRAnimation} autoPlay loop />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Mondo a retirar</Text>

                    <View style={styles.rowInput}>
                        <TextInput
                            style={[GlobalStyles.textInput, { flex: 1 }]}
                            value={amount}
                            onChangeText={(value) => setAmount(value)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.legend}>Moneda</Text>

                    <View style={GlobalStyles.containerPicker}>
                        <Picker style={GlobalStyles.picker}
                            selectedValue={coin}
                            onValueChange={(value) => setCoin(value)}>
                            {
                                coinList.map((item, index) => (
                                    <Picker.Item enabled={true} key={index} label={item.name} value={item.symbol} />))
                            }
                        </Picker>
                    </View>
                </View>
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: RFValue(10),
        backgroundColor: Colors.$colorMain
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
    logo: {
        alignSelf: "center",
        // backgroundColor: 'red',
        resizeMode: 'contain',
        height: RFValue(160),
        width: RFValue(380),
    }
})

export default Retirements
