import React, { useState, useEffect } from "react"

// Import components
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Keyboard,
    Image,
    Platform,
    Alert,
    Text,
} from "react-native"
import { BlurView } from "@react-native-community/blur"
import Modal from "react-native-modal"
import Icon from "react-native-vector-icons/Entypo"
import Lottie from "lottie-react-native"

// Import funtions and constanst
import {
    RFValue,
    logOutApp,
    OpenSupport,
    Colors,
} from "../../utils/constants.util"
import { useNavigation, StackActions } from "@react-navigation/native"

// Import Assets
import Facturar from "../../assets/img/facturar.png"
import Enviar from "../../assets/img/enviar.png"
import Historial from "../../assets/img/history.png"
import whatsapp from "../../animations/Whatsapp.json"
import Exit from "../../animations/logout.json"
import Transaction from "../../assets/img/transacction.png"

// Import Store
import store from "../../store/index"

iconSize = RFValue(32)

const Navbar = () => {
    const { global } = store.getState()
    // console.log("Global", global.rol)

    const [hidden, setHidden] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { navigate } = useNavigation()

    const toggleMenu = () => {
        Alert.alert(
            "Cerrar Sesion",
            "Esta apunto de cerrar sesion en Alypay Ecommerce",
            [
                {
                    text: "Cancelar",
                    onPress: () => {},
                },
                {
                    text: "Cerrar Sesion",
                    onPress: logOut,
                },
            ],
        )
    }

    const goToTop = () => {
        navigate("Payment")
    }

    const logOut = async () => {
        try {
            await logOutApp()
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Funcion que me permite navegar a la vista de enviar
     */
    const onSend = () => {
        navigate("Send")
    }

    const onHistory = () => {
        navigate("History")
    }

    useEffect(() => {
        // Ocultamos el menu cuando el teclado se active
        const eventShowKeyboard = Keyboard.addListener("keyboardDidShow", () =>
            setHidden(true),
        )

        // Mostramos el menu cuando el teclado se oculte
        const eventHideKeyboard = Keyboard.addListener("keyboardDidHide", () =>
            setHidden(false),
        )

        return () => {
            // Removemos los eventos cuando el componente se desmonte
            eventShowKeyboard.remove()
            eventHideKeyboard.remove()
        }
    }, [])

    if (!hidden) {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        {Platform.OS === "ios" && (
                            <BlurView style={styles.absolute} blurType="dark" />
                        )}

                        <View style={styles.containerButtons}>
                            <TouchableOpacity
                                onPress={goToTop}
                                style={styles.button}>
                                <Image
                                    source={Facturar}
                                    style={styles.imageProfile}
                                />
                                <Text style={styles.text}>Facturar</Text>
                            </TouchableOpacity>

                            {global.rol === 1 || global.rol === 2 ? (
                                <TouchableOpacity
                                    onPress={onSend}
                                    style={styles.button}>
                                    <Image
                                        source={Enviar}
                                        style={styles.imageProfile}
                                    />
                                    <Text style={styles.text}>Enviar</Text>
                                </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity
                                onPress={onHistory}
                                style={styles.button}>
                                <Image
                                    source={Historial}
                                    style={styles.imageProfile}
                                />
                                <Text style={styles.text}>Historial</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={(_) => setShowModal(true)}>
                                <Icon
                                    name="dots-three-vertical"
                                    size={25}
                                    color={Colors.$colorYellow}
                                />
                            </TouchableOpacity>
                        </View>

                        {Platform.OS === "ios" && (
                            <View style={{ height: 20 }} />
                        )}
                    </View>
                </View>

                <Modal
                    isVisible={showModal}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                    backdropOpacity={0}
                    style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: RFValue(70),
                    }}
                    onBackdropPress={(_) => setShowModal(false)}
                    onBackButtonPress={(_) => setShowModal(false)}>
                    <View style={styles.containerModal}>
                        {/* <TouchableOpacity
                            onPress={OpenSupport}
                            style={styles.selectionMenu}>
                            <Text style={styles.textSelection}>
                                Transacciónes
                            </Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            onPress={OpenSupport}
                            style={styles.selectionMenu}>
                            <Lottie
                                style={styles.imageItem}
                                source={whatsapp}
                                autoPlay
                                loop={true}
                            />
                            <Text style={styles.textSelection}>Soporte</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleMenu}
                            style={styles.selectionMenu}>
                            <Lottie
                                style={styles.imageItem}
                                source={Exit}
                                autoPlay
                                loop={true}
                            />
                            <Text style={styles.textSelection}>Salir</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </>
        )
    }
    return null
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: Colors.colorYellow,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 100,
    },

    absolute: {
        ...StyleSheet.absoluteFillObject,
    },

    subContainer: {
        backgroundColor:
            Platform.OS === "ios" ? "transparent" : Colors.$colorBlack,
        position: "relative",
        flex: 1,
    },

    containerButtons: {
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    button: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        // backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: RFValue(5),
        flex: 1,
    },

    text: {
        color: Colors.$colorYellow,
        marginTop: 5,
        fontSize: RFValue(9),
    },

    imageProfile: {
        borderRadius: iconSize * 2,
        resizeMode: "contain",
        width: iconSize,
        height: iconSize,
    },
    legend: {
        color: Colors.$colorYellow,
        fontSize: RFValue(13),
    },
    containerModal: {
        backgroundColor: Colors.$colorBlack,
        marginTop: "50%",
        padding: RFValue(10),
        // marginLeft: RFValue(100),
        justifyContent: "center",
        // alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.$colorYellow,
        width: "45%",
    },
    selectionMenu: {
        position: "relative",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
    },

    textSelection: {
        fontSize: RFValue(14),
        color: "#FFF",
        marginLeft: 10,
    },
    imageItem: {
        height: RFValue(24),
        width: RFValue(24),
    },
})

export default Navbar
