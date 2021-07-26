import React, { useState, useReducer } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"

// Import components
import Lottie from "lottie-react-native"
import Modal from "react-native-modal"
import QRCodeScanner from "react-native-qrcode-scanner"
import {
    RFValue,
    Colors,
    GlobalStyles,
    http,
    getHeaders,
    errorMessage,
    successMessage,
    getFeePercentage,
} from "../../utils/constants.util"
import { RNCamera } from "react-native-camera"
import { View as ViewAnimation } from "react-native-animatable"
import Container from "../../components/Container/Container"
import Loader from "../../components/Loader/Loader"
import _ from "lodash"

// Import Assets
import QR from "../../animations/scan-qr.json"
import profileVerifedAnimation from "../../animations/profile-verifed.json"
import defaultAvatar from "../../assets/img/profile-default.png"

// Import redux store
import store from "../../store"

const initialState = {
    amountFraction: "",
    amountUSD: "",
    walletAdress: "",
    fee: "0",

    dataWallet: null,
    walletAccepted: false,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload,
    }
}

const sentComponent = () => {
    const { global, walletInfo, functions } = store.getState()
    const { navigate } = useNavigation()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loader, setLoader] = useState(false)
    const [showScanner, setShowScanner] = useState(false)

    // console.log("Global", functions.reloadInfoWallets)
    // console.log("WalletInfo", walletInfo)

    // Hacemos la peticion al server
    const submit = async () => {
        try {
            if (state.amountFraction.trim().length === 0) {
                throw String("Ingrese un monto")
            }

            setLoader(true)

            const dataSent = {
                amount: parseFloat(state.amountFraction),
                wallet: state.walletAdress,
                id: global.rol === 1 ? walletInfo.id : global.wallet_commerce,
                idCommerce: global.id_commerce,
            }

            // console.log("Sent", dataSent)

            const { data } = await http.post(
                "ecommerce/transaction",
                dataSent,
                getHeaders(),
            )

            if (data.error) {
                errorMessage(data.message)
            }

            if (data.response === "success") {
                successMessage("Tu transaccion se ha completado")

                // Limpiamos el usuario remitente
                dispatch({ type: "dataWallet", payload: "" })
                dispatch({ type: "amountFraction", payload: "" })

                // limpiamos la direccion de wallet
                dispatch({ type: "walletAdress", payload: "" })
                dispatch({ type: "walletAccepted", payload: false })

                // limpiamos el fee
                dispatch({ type: "fee", payload: "0" })

                if (global.rol === 1) {
                    functions?.reloadInfoWallets()
                }
            }
        } catch (error) {
            errorMessage(error.toString())
        } finally {
            setLoader(false)
        }
    }

    // Comprobamos la billetera de destino
    const onComprobateWallet = async () => {
        try {
            if (state.walletAdress.length < 90) {
                throw String("Dirección de billetera incorrecta")
            }

            // get data wallet
            const { data } = await http.get(
                `/api/ecommerce/wallet/verify/${state.walletAdress}`,
                getHeaders(),
            )

            if (data.error) {
                throw String("Billetera no encontrada, intente nuevamente")
            }

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

    // Nos movemos a la vista de retiro
    const onRetirement = () => {
        navigate("Retirements", { wallet: global.wallet_commerce })
    }

    // Funcion que nos permite scannear el codigo QR
    const onReadCodeQR = ({ data }) => {
        toggleScan()

        dispatch({ type: "walletAdress", payload: data })
    }

    // Funcion que nos permite calcular el fee de los montos
    const onChangeAmount = (str) => {
        dispatch({ type: "amountFraction", payload: str })

        const { fee } = getFeePercentage(str, 1, global.fees)
        dispatch({ type: "fee", payload: fee * str })
    }

    const toggleScan = () => setShowScanner(!showScanner)

    return (
        <Container showLogo showCard>
            <Loader isVisible={loader} />

            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.legendTitle}>Enviar fondos</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.legend}>
                            Dirección de billetera
                        </Text>

                        <View style={styles.rowInput}>
                            <TextInput
                                style={[GlobalStyles.textInput, { flex: 1 }]}
                                value={state.walletAdress}
                                returnKeyType="done"
                                onChangeText={(payload) =>
                                    dispatch({ type: "walletAdress", payload })
                                }
                            />

                            <TouchableOpacity
                                onPress={toggleScan}
                                style={styles.buttonScan}>
                                <Lottie
                                    source={QR}
                                    style={styles.lottieQRAnimation}
                                    autoPlay
                                    loop
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.legend}>Monto (USD)</Text>

                        <View style={styles.rowInput}>
                            <TextInput
                                style={[GlobalStyles.textInput, { flex: 1 }]}
                                value={state.amountFraction}
                                onChangeText={onChangeAmount}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                    <View style={[styles.col, { justifyContent: "center" }]}>
                        <View style={styles.rowInput}>
                            <Text style={styles.legend}>Fee</Text>
                        </View>
                        <View style={styles.rowInput}>
                            <Text
                                style={{
                                    color: "#FFF",
                                    fontSize: RFValue(24),
                                }}>
                                {_.floor(state.fee, 2)} USD
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: RFValue(5) }} />

                {state.walletAccepted && state.dataWallet !== null && (
                    <ViewAnimation animation="fadeIn" style={styles.cardInfo}>
                        <View style={styles.subCard}>
                            <Image
                                style={styles.avatar}
                                source={defaultAvatar}
                            />

                            <View>
                                <Text style={styles.usernameCard}>
                                    @{state.dataWallet.username}
                                </Text>
                                <Text style={styles.textFromCard}>
                                    {state.dataWallet.city}
                                </Text>
                            </View>
                        </View>

                        <Lottie
                            source={profileVerifedAnimation}
                            style={styles.lottieVerifed}
                            autoPlay
                        />
                    </ViewAnimation>
                )}

                {!state.walletAccepted && (
                    <View style={styles.retirementContainer}>
                        {global.rol === 1 ? (
                            <>
                                <TouchableOpacity onPress={onRetirement}>
                                    <Text style={styles.retirementText}>
                                        Retirar fondos
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onComprobateWallet}
                                    style={[
                                        GlobalStyles.buttonPrimary,
                                        { flex: 1, marginLeft: 25 },
                                    ]}>
                                    <Text style={GlobalStyles.textButton}>
                                        siguiente
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={onComprobateWallet}
                                    style={[
                                        GlobalStyles.buttonPrimary,
                                        { flex: 1 },
                                    ]}>
                                    <Text style={GlobalStyles.textButton}>
                                        siguiente
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

                {state.walletAccepted && (
                    <TouchableOpacity
                        onPress={submit}
                        style={GlobalStyles.buttonPrimary}>
                        <Text style={GlobalStyles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                )}

                <Modal
                    backdropOpacity={0.9}
                    animationIn="fadeIn"
                    onBackButtonPress={toggleScan}
                    onBackdropPress={toggleScan}
                    animationOut="fadeOut"
                    isVisible={showScanner}>
                    <View style={styles.constainerQR}>
                        <QRCodeScanner
                            onRead={onReadCodeQR}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                        />
                    </View>
                </Modal>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: RFValue(10),
        padding: 10,
        width: "100%",
    },
    containerTitle: {
        flexDirection: "row",
        justifyContent: "center",
    },
    legendTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(24),
        textTransform: "uppercase",
        marginBottom: 10,
    },
    col: {
        flex: 1,
        marginHorizontal: RFValue(10),
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: RFValue(10),
    },

    legend: {
        color: Colors.$colorYellow,
        fontSize: RFValue(14),
    },

    rowInput: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },

    buttonScan: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: RFValue(5),
        padding: RFValue(5),
        marginLeft: RFValue(10),
        zIndex: 1000,
    },

    lottieQRAnimation: {
        height: RFValue(40),
        width: RFValue(40),
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
        /* justifyContent: "space-evenly", */
        flexDirection: "row",
        padding: RFValue(10),
        marginHorizontal: RFValue(10),
    },
    cardInfo: {
        alignItems: "center",
        backgroundColor: Colors.$colorBlack,
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
        width: RFValue(300),
        height: RFValue(100),
        marginBottom: RFValue(40),
    },
})

export default sentComponent
