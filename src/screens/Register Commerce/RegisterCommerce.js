import React, { useState, useEffect, useReducer } from "react"
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform,
    KeyboardAvoidingView,
} from "react-native"
import { PERMISSIONS, request, check } from "react-native-permissions"

// Import Component
import Container from "../../components/Container/Container"
import { Image, View as ViewAnimation } from "react-native-animatable"
import Loader from "../../components/Loader/Loader"
import {
    Colors,
    RFValue,
    showNotification,
    http,
    GlobalStyles,
    successMessage,
    checkPermisionLocation,
} from "../../utils/constants.util"
import Icon from "react-native-vector-icons/MaterialIcons"
import MapView, { Marker } from "react-native-maps"
import Geolocation from "react-native-geolocation-service"
import validator from "validator"
import { Picker } from "@react-native-community/picker"
import Modal from "react-native-modal"
import UploadImage from "../../components/UploadImage/UploadImage"
import { launchCamera } from "react-native-image-picker"

// Import Assets
import Logo from "../../assets/img/logo.png"
import countries from "../../utils/countries.json"

const initialState = {
    email: "",
    password: "",
    commerceType: "",
    description: "",
    phoneCommerce: "",
    physicalAddress: "",
    latitude: null,
    longitude: null,
    profilePicture: null,

    filter: "",
    country: countries[0],
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload,
    }
}

const optionsOpenCamera = {
    //noData: true,
    maxHeight: 1024,
    maxWidth: 1024,
    quality: 0.6,
    mediaType: "photo",
    storageOptions: {
        skipBackup: true,
        path: "Pictures/myAppPicture/", //-->this is FUCK neccesary
        privateDirectory: true,
    },
    cameraType: "back",
}
const RegisterCommerce = ({ route, navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loader, setLoader] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")

    const companyId = route.params?.companyId

    // Estado que visualiza el mapa en un modal
    const [showModal, setShowModal] = useState(false)

    // Estados que permiten previsualizar las contraseñas
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Estado que indica si muestra la modal de paises
    const [modalCoutry, setModalCountry] = useState(false)

    /**
     * Funcion que permite guardar la seleccion del pais
     * @param {*} item
     */
    const selectedCountry = (item) => {
        dispatch({ type: "country", payload: item })

        setModalCountry(false)
    }

    /**render element country modal */
    const ItemCountry = ({ item }) => {
        if (
            item.name.length > 0 &&
            item.name.toLowerCase().search(state.filter.toLocaleLowerCase()) >
                -1
        ) {
            return (
                <TouchableOpacity
                    style={styles.itemCountry}
                    onPress={(_) => selectedCountry(item)}>
                    <Text style={{ color: "#FFF" }}>{item.name}</Text>
                    <Text style={{ color: Colors.$colorYellow }}>
                        {item.phoneCode}
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    const uploadImage = async (imageDestination) => {
        try {
            launchCamera(optionsOpenCamera, (response) => {
                if (response.error) {
                    throw String(response.error)
                }
                dispatch({ type: imageDestination, payload: response })
            })
        } catch (error) {
            showNotification(error.toString())
        }
    }

    const createForData = (body) => {
        const data = new FormData()

        data.append("profilePicture", {
            name: state.profilePicture.fileName,
            type: state.profilePicture.type,
            uri:
                Platform.OS === "android"
                    ? state.profilePicture.uri
                    : state.profilePicture.uri.replace("file://", ""),
        })

        Object.keys(body).forEach((key) => {
            data.append(key, body[key])
        })

        return data
    }

    // Hacemos la peticion al server
    const onSubmit = async () => {
        try {
            setLoader(true)

            if (state.companyName.trim().length === 0) {
                throw String("Ingrese el nombre de la compañía")
            }

            if (!validator.isEmail(state.email)) {
                throw String("Ingrese un correo electrónico valido")
            }

            if (state.password.trim().length === 0) {
                throw String("Ingrese una constasena")
            }

            if (state.password !== confirmPassword) {
                throw String("Las contraseña nos coinciden")
            }

            if (state.phoneCommerce.trim().length === 0) {
                throw String("Ingrese un numero de telefono")
            }

            const dataSent = {
                idCompany: companyId,
                email: state.email,
                password: state.password,
                description: state.companyName,
                commerceType: state.commerceType,
                phoneCommerce: state.phoneCommerce,
                physicalAddress: state.physicalAddress,
                latitude: state.latitude,
                longitude: state.longitude,
            }

            const { data } = await http.post(
                "/ecommerce/company/commerce",
                createForData(dataSent),
            )

            if (data.error) {
                throw String(data.message)
            }
            data.response === "success"
            successMessage(
                "Registro completo espero la verificacion de su cuenta",
            )
            navigation.navigate("Login")
        } catch (error) {
            showNotification(error.toString())
        } finally {
            setLoader(false)
        }
    }

    // Funcion que nos permite verificar si el correo ya existe en la base de datos
    const validateEmailFunction = async (value) => {
        try {
            const dataEmail = {
                email: value,
            }

            const { data } = await http.post(
                "/ecommerce/company/comprobate-email",
                dataEmail,
            )

            if (data.error) {
                throw String(data.message)
            }
        } catch (error) {
            showNotification(error.toString())
        }
    }

    // Funcion que permite dar los permisos para la Geolocalizacion
    const ConfigureLocation = async () => {
        try {
            if (Platform.OS === "android") {
                await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                const auth = await check(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                )

                if (auth === "granted") {
                    position()
                }
            }
        } catch (error) {
            showNotification(error.toString())
        }
    }

    // Funcion que almacena la posicion en el mapa
    const position = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                if (position !== null && position !== undefined) {
                    dispatch({
                        type: "latitude",
                        payload: position.coords.latitude,
                    })
                    dispatch({
                        type: "longitude",
                        payload: position.coords.longitude,
                    })
                }
            },
            (error) => {
                console.log(error.message)
            },
        )
    }

    useEffect(() => {
        ConfigureLocation()
        //position()
    }, [])

    return (
        <KeyboardAvoidingView style={styles.container1}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={styles.scrollView}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={Logo} />

                    <Loader isVisible={loader} />

                    <ViewAnimation
                        style={[styles.tab, { paddingBottom: RFValue(20) }]}
                        animations="fadeIn">
                        <View style={styles.containerTitle}>
                            <Text
                                style={{
                                    color: Colors.$colorYellow,
                                    fontSize: RFValue(20),
                                }}>
                                Registro de Comercio
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Nombre del comercio
                                </Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese nombre del comercio aqui"
                                placeholderTextColor="#CCC"
                                value={state.companyName}
                                onChangeText={(str) =>
                                    dispatch({
                                        type: "companyName",
                                        payload: str,
                                    })
                                }
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Correo electrónico del comercio
                                </Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese correo del comercio aqui"
                                placeholderTextColor="#CCC"
                                value={state.email}
                                keyboardType="email-address"
                                onChangeText={(str) =>
                                    dispatch({ type: "email", payload: str })
                                }
                                onBlur={(_) =>
                                    validateEmailFunction(state.email)
                                }
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Contraseña</Text>
                            </View>
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
                                    onPress={(e) =>
                                        setShowPassword(!showPassword)
                                    }
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
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Repetir Contraseña
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.textInputWithImage,
                                    GlobalStyles.textInput,
                                ]}>
                                <TextInput
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={(value) =>
                                        setConfirmPassword(value)
                                    }
                                    placeholder="Contraseña"
                                    placeholderTextColor="#CCC"
                                    style={styles.textInputCol}
                                />
                                <TouchableOpacity
                                    onPress={(e) =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    style={styles.touchableCol}>
                                    <Icon
                                        name={
                                            showConfirmPassword
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
                            <Text style={styles.legendRow}>
                                Numero de telefono
                            </Text>

                            <View style={styles.rowPhoneNumber}>
                                <TouchableOpacity
                                    style={[
                                        GlobalStyles.textInput,
                                        {
                                            marginRight: 10,
                                            justifyContent: "center",
                                        },
                                    ]}
                                    onPress={(_) => setModalCountry(true)}>
                                    <Text style={{ color: Colors.$colorGray }}>
                                        {state.country.phoneCode}
                                    </Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={[
                                        GlobalStyles.textInput,
                                        { flex: 1 },
                                    ]}
                                    placeholder="Ingrese numero de telefono"
                                    placeholderTextColor="#CCC"
                                    value={state.phoneCommerce}
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    keyboardAppearance="dark"
                                    onChangeText={(payload) =>
                                        dispatch({
                                            type: "phoneCommerce",
                                            payload,
                                        })
                                    }
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Tipo de comercio
                                </Text>
                            </View>

                            <View style={GlobalStyles.containerPicker}>
                                <Picker
                                    style={GlobalStyles.picker}
                                    selectedValue={state.commerceType}
                                    onValueChange={(id) =>
                                        dispatch({
                                            type: "commerceType",
                                            payload: id,
                                        })
                                    }>
                                    <Picker.Item
                                        label="Seleccione una categoria"
                                        value={0}
                                    />
                                    <Picker.Item
                                        label="Abarrotería"
                                        value={1}
                                    />
                                    <Picker.Item
                                        label="Agencia de Viajes"
                                        value={2}
                                    />
                                    <Picker.Item label="Bar" value={3} />
                                    <Picker.Item label="Bazar" value={4} />
                                    <Picker.Item label="Cafetería" value={5} />
                                    <Picker.Item
                                        label="Centro Comercial"
                                        value={6}
                                    />
                                    <Picker.Item label="Heladería" value={7} />
                                    <Picker.Item label="Discoteca" value={8} />
                                    <Picker.Item
                                        label="Estacion de Servicios"
                                        value={9}
                                    />
                                    <Picker.Item
                                        label="Ferretería"
                                        value={10}
                                    />
                                    <Picker.Item label="Almacén" value={11} />
                                    <Picker.Item
                                        label="Hotel / Hospedaje"
                                        value={12}
                                    />
                                    <Picker.Item label="Joyería" value={13} />
                                    <Picker.Item label="Librería" value={14} />
                                    <Picker.Item label="Mercado" value={15} />
                                    <Picker.Item
                                        label="Repostería"
                                        value={16}
                                    />
                                    <Picker.Item
                                        label="Restaurante"
                                        value={17}
                                    />
                                    <Picker.Item label="Tienda" value={18} />
                                    <Picker.Item
                                        label="Venta Minorista"
                                        value={19}
                                    />
                                    <Picker.Item label="Otros" value={20} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Punto de referencia
                                </Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese un punto de referencia del comercio"
                                placeholderTextColor="#CCC"
                                value={state.physicalAddress}
                                onChangeText={(str) =>
                                    dispatch({
                                        type: "physicalAddress",
                                        payload: str,
                                    })
                                }
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Dirección Física
                                </Text>
                            </View>

                            <View
                                style={
                                    showModal
                                        ? styles.mapFullScreen
                                        : styles.mapContainer
                                }>
                                {state.latitude !== null &&
                                    state.longitude !== null && (
                                        <MapView
                                            style={styles.map}
                                            initialRegion={{
                                                longitude: state.longitude,
                                                latitude: state.latitude,
                                                latitudeDelta: 0.05,
                                                longitudeDelta: 0.05,
                                            }}
                                            onMarkerDragEnd={(event) => {
                                                dispatch({
                                                    type: "longitude",
                                                    payload:
                                                        event.nativeEvent
                                                            .coordinate
                                                            .longitude,
                                                })
                                                dispatch({
                                                    type: "latitude",
                                                    payload:
                                                        event.nativeEvent
                                                            .coordinate
                                                            .latitude,
                                                })
                                            }}>
                                            <Marker
                                                coordinate={{
                                                    longitude: state.longitude,
                                                    latitude: state.latitude,
                                                }}
                                                draggable={true}
                                            />
                                        </MapView>
                                    )}

                                <TouchableOpacity
                                    onPress={(_) => setShowModal(!showModal)}>
                                    <Icon
                                        name={
                                            showModal
                                                ? "fullscreen-exit"
                                                : "fullscreen"
                                        }
                                        size={40}
                                        color={Colors.$colorYellow}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.position}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>
                                    Sube el logo del negocio
                                </Text>
                            </View>

                            <UploadImage
                                value={state.profilePicture}
                                onChange={(_) => uploadImage("profilePicture")}
                            />
                        </View>

                        <View style={styles.row}>
                            <TouchableOpacity
                                onPress={onSubmit}
                                style={[
                                    GlobalStyles.buttonPrimary,
                                    styles.button,
                                ]}>
                                <Text style={GlobalStyles.textButton}>
                                    GUARDAR
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ViewAnimation>
                </View>
            </ScrollView>

            <Modal
                onBackdropPress={(_) => setModalCountry(false)}
                onBackButtonPress={(_) => setModalCountry(false)}
                isVisible={modalCoutry}>
                <View style={styles.containerModal}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        placeholder="Buscar"
                        placeholderTextColor="#FFF"
                        value={state.filter}
                        onChangeText={(str) =>
                            dispatch({ type: "filter", payload: str })
                        }
                    />

                    <View style={{ height: 10 }} />

                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={countries}
                        renderItem={ItemCountry}
                        keyExtractor={(_, i) => i.toString()}
                    />
                </View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    container1: {
        alignItems: "center",
        backgroundColor: Colors.$colorMain,
        flex: 1,
    },

    container: {
        alignItems: "center",
        paddingHorizontal: "5%",
        width: "100%",
        //marginRight: '25%',
        flexDirection: "column",
        //justifyContent: "space-between",
        // flex: 1,
    },
    containerTitle: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
    },
    containerModalSuccess: {
        alignSelf: "center",
        backgroundColor: Colors.$colorMain,
        borderRadius: 10,
        padding: 10,
        height: "80%",
        width: "90%",
    },
    containerModal: {
        alignSelf: "center",
        backgroundColor: Colors.$colorMain,
        borderRadius: 10,
        padding: 10,
        height: "80%",
        width: "90%",
    },

    logo: {
        resizeMode: "contain",
        height: RFValue(128),
        width: RFValue(256),
    },
    legendRow: {
        color: Colors.$colorYellow,
        fontSize: RFValue(16),
    },
    labelsRow: {
        alignItems: "center",
        position: "relative",
        marginBottom: 5,
        flexDirection: "row",
    },
    row: {
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
    },
    tab: {
        width: "100%",
    },
    textInputWithImage: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    touchableCol: {
        flex: 0.1,
        alignItems: "flex-end",
    },
    textInputCol: {
        flex: 0.9,
        paddingLeft: 5,
        padding: 0,
        color: "white",
    },
    rowPhoneNumber: {
        alignItems: "stretch",
        flexDirection: "row",
        marginTop: RFValue(5),
        width: "100%",
    },
    rowButtons: {
        alignItems: "center",
        // marginTop: 10,
        marginVertical: RFValue(25),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    position: {
        padding: 10,
    },
    textBack: {
        color: Colors.$colorYellow,
        textTransform: "uppercase",
        fontSize: RFValue(16),
    },
    button: {
        marginTop: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        height: 250,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    mapFullScreen: {
        flex: 1,
        // ...StyleSheet.absoluteFillObject,
        height: 500,
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    position: {
        padding: 10,
    },
    labelsRow: {
        alignItems: "center",
        position: "relative",
        marginBottom: 5,
        flexDirection: "row",
    },
    itemCountry: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: Colors.$colorYellow,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
    },
})

export default RegisterCommerce
