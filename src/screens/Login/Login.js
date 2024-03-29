import React, { useEffect, useReducer, useState } from "react"
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native"

// Import Component
import ButtonSupport from "../../components/buttonsupport.component"
import ButtonWithIcon from "../../components/button-with-icon.component"
import Loader from "../../components/Loader/Loader"
import Icon from "react-native-vector-icons/MaterialIcons"
import { showMessage } from "react-native-flash-message"

// Import funtion and constants
import {
    Colors,
    errorMessage,
    reducer,
    setStorage,
    http,
    RFValue,
    GlobalStyles,
} from "../../utils/constants.util"
import {
    getBrand,
    getDeviceId,
    getMacAddress,
    getSystemName,
} from "react-native-device-info"
import validator from "validator"

// Import Assets
import Logo from "../../assets/img/logo.png"
import LogoFooter from "../../assets/img/aly-system-by.png"

// Import redux
import store from "../../store"
import { SETNAVIGATION, SETSTORAGE } from "../../store/actionTypes"

const initialState = {
    email: "",
    password: "",

    // Device info
    ipAddress: "",
    device: "",
    macAddress: "",
    systemName: "",
}

const Login = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [showLoader, setShowLoader] = useState(false)

    /**
     * Metodo que se ejecuta cuando el usuario hace login
     */
    const onSubmit = async () => {
        try {
            setShowLoader(true)
            if (!validator.isEmail(state.email.trim())) {
                throw "Correo electronico no es valido"
            }

            if (state.password.length === 0) {
                throw "Ingrese una contraseña"
            }

            const variables = {
                email: state.email,
                password: state.password,
                public_ip: state.ipAddress || "",
                device: state.device || "",
                mac_address: state.macAddress || "",
                system_name: state.systemName || "",
            }

            const { data } = await http.post("/ecommerce/login", variables)

            if (data.error) {
                throw String(data.message)
            } else {
                if (Object.values(data).length > 0) {
                    store.dispatch({ type: SETSTORAGE, payload: data })

                    setStorage(data)
                }
            }
        } catch (error) {
            showMessage({
                message: error.toString(),
                description: "Error al autenticar",
                color: "#FFF",
                backgroundColor: Colors.$colorRed,
                icon: "warning",
            })
        } finally {
            setShowLoader(false)
        }
    }

    const getDeviceInfo = async () => {
        try {
            const device = getBrand()
            const deviceId = getDeviceId()

            dispatch({ type: "device", payload: `${device} - ${deviceId}` })

            await getMacAddress().then((payload) =>
                dispatch({ type: "macAddress", payload }),
            )

            const systemVersion = getSystemName()

            dispatch({ type: "systemName", payload: systemVersion })
        } catch (error) {
            errorMessage(error.toString())
        }
    }

    // Funcion que nos permite ir a la vista de Dataphone
    // const onDataphone = () => {
    //     navigation.navigate("DatePhone")
    // }

    useEffect(() => {
        store.dispatch({ type: SETNAVIGATION, payload: navigation })

        getDeviceInfo()
    }, [navigation])

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="always"
                style={styles.scroll}>
                <View style={styles.subContainer}>
                    <Image source={Logo} style={styles.logo} />

                    <View style={styles.row}>
                        <Text style={styles.legend}>Correo electrónico</Text>

                        <TextInput
                            value={state.email}
                            keyboardType="email-address"
                            onChangeText={(payload) =>
                                dispatch({ type: "email", payload })
                            }
                            placeholderTextColor="#CCC"
                            placeholder="Correo electrónico"
                            style={GlobalStyles.textInput}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.legend}>Contraseña</Text>

                        <View
                            style={[
                                styles.textInputWithImage,
                                GlobalStyles.textInput,
                            ]}>
                            <TextInput
                                secureTextEntry={!showPassword}
                                value={state.password}
                                onChangeText={(payload) =>
                                    dispatch({ type: "password", payload })
                                }
                                placeholder="Contraseña"
                                placeholderTextColor="#CCC"
                                style={styles.textInputCol}
                            />
                            <TouchableOpacity
                                onPress={(_) => setShowPassword(!showPassword)}
                                style={styles.touchableCol}>
                                <Icon
                                    name={
                                        showPassword
                                            ? "visibility-off"
                                            : "visibility"
                                    }
                                    color={Colors.$colorYellow}
                                    size={18}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <View
                                style={{
                                    ...styles.horizontalChild,
                                    marginRight: 10,
                                }}>
                                <ButtonWithIcon
                                    text="Registrar"
                                    onPress={() =>
                                        navigation.navigate("Register")
                                    }
                                    icon="store"
                                    type="filled"
                                />
                            </View>

                            <View
                                style={{
                                    ...styles.horizontalChild,
                                    marginLeft: 10,
                                }}>
                                <ButtonWithIcon
                                    onPress={onSubmit}
                                    text="Ingresar"
                                    icon="login"
                                    type="filled"
                                />
                            </View>
                        </View>
                    </View>

                    {/* <TouchableOpacity
                        style={styles.containerFooter}
                        onPress={onDataphone}>
                        <Icon
                            name="settings-cell"
                            size={18}
                            style={styles.iconFooter}
                        />
                        <Text style={styles.legendFooter}>Datáfono</Text>
                    </TouchableOpacity> */}

                    <Image source={LogoFooter} style={styles.from} />
                </View>

                {/* <FooterComponent /> */}
            </ScrollView>
            <Loader isVisible={showLoader} />
            <ButtonSupport />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: Colors.$colorMain,
        flex: 1,
    },
    subContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: "10%",
        width: "100%",
    },
    row: {
        marginVertical: 10,
        width: "100%",
    },
    legend: {
        color: Colors.$colorYellow,
        marginBottom: 5,
    },
    col: {
        justifyContent: "space-around",
        flexDirection: "row",
        width: "100%",
    },
    from: {
        justifyContent: "flex-start",
        height: RFValue(60),
        alignSelf: "center",
        resizeMode: "contain",
        marginTop: "25%",
        opacity: 0.8,
        width: RFValue(200),
    },
    textTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(26),
        fontWeight: "bold",
    },
    viewChild: {
        backgroundColor: Colors.$colorMain,
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    inputLabel: {
        color: Colors.$colorYellow,
        paddingBottom: RFValue(5),
        paddingLeft: RFValue(15),
    },
    forgotPasswordLabel: {
        color: Colors.$colorGray,
        fontSize: RFValue(15),
        textAlign: "right",
        fontStyle: "italic",
        textDecorationLine: "underline",
    },
    inputContainer: {
        backgroundColor: Colors.$colorMain,
        borderColor: Colors.$colorYellow,
        borderWidth: 3,
        borderStyle: "solid",
        borderRadius: RFValue(5),
        marginHorizontal: RFValue(20),
        marginVertical: RFValue(10),
        padding: RFValue(10),
        fontSize: RFValue(15),
        color: "white",
    },
    horizontalContainer: {
        flexDirection: "row",
        paddingHorizontal: RFValue(20),
        paddingVertical: RFValue(25),
    },
    horizontalChild: {
        flex: 0.5,
    },
    buttonFilled: {
        color: "white",
        backgroundColor: Colors.$colorYellow,
        borderColor: Colors.$colorYellow,
        borderWidth: 3,
        borderRadius: 25,
        marginEnd: RFValue(20),
    },
    buttonOutlined: {
        color: "white",
        borderColor: Colors.$colorYellow,
        borderWidth: 3,
        borderRadius: 25,
        marginStart: 20,
    },
    logo: {
        width: RFValue(300),
        height: RFValue(100),
        marginBottom: RFValue(40),
    },
    logoAly: {
        width: 200,
        height: 100,
        resizeMode: "contain",
    },
    textInputWithImage: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textInputCol: {
        flex: 0.9,
        paddingLeft: 5,
        padding: 0,
        color: "white",
    },
    touchableCol: {
        flex: 0.1,
        alignItems: "flex-end",
    },
    containerFooter: {
        flexDirection: "row",
        marginTop: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    legendFooter: {
        fontSize: RFValue(20),
        color: Colors.$colorYellow,
        textDecorationLine: "underline",
    },
    iconFooter: {
        color: Colors.$colorYellow,
    },
})

export default Login
