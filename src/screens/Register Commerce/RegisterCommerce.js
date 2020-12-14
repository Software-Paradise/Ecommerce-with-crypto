import React, { useState, useEffect, useRoute, useReducer } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import { Image, View as ViewAnimation } from 'react-native-animatable'
import Loader from '../../components/Loader/Loader'
import { Colors, RFValue, showNotification, http, serverAddress, getHeaders, GlobalStyles } from '../../utils/constants.util'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'

// Import Assets
import Logo from '../../assets/img/logo.png'

const initialState = {
    username: '',
    email: '',
    password: '',
    commerceType: '',
    description: '',
    emailCommerce: '',
    phoneCommerce: '',
    physicalAddress: '',
    latitude: null,
    longitude: null,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const RegisterCommerce = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loader, setLoader] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    // Estado que visualiza el mapa en un modal
    const [showModal, setShowModal] = useState(false)

    // const route = useRoute();

    // Estados que permiten previsualizar las contraseñas
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const ConfigureLocation = async () => {
        await Geolocation.setRNConfiguration({
            distanceFilter: 5.0,
            desiredAccuracy: {
                ios: 'bestForNavigation',
                android: 'balancedPowerAccuracy',
            }
        });

        try {
            Geolocation.requestAuthorization()
        } catch (error) {
            console.log(error.message);
        }
    };


    const position = () => {
        Geolocation.getCurrentPosition((position) => {
            if (position !== null && position !== undefined) {
                dispatch({ type: "latitude", payload: position.coords.latitude })
                dispatch({ type: "longitude", payload: position.coords.longitude })
            }
        })
    }

    useEffect(() => {
        ConfigureLocation()
        position()
    }, [])

    return (
        <Container hideNavbar >
            <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={Logo} />

                    <Loader isVisible={loader} />

                    <ViewAnimation style={[styles.tab, { paddingBottom: RFValue(20) }]} animations="fadeIn" >
                        <View style={styles.containerTitle}>
                            <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(20) }}>Registro de Comercio</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Nombre de la compañía</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese nombre de la compañía aqui"
                                placeholderTextColor={Colors.$colorGray}
                                value={state.companyName}
                                onChangeText={str => dispatch({ type: 'companyName', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Correo electrónico</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese correo aqui"
                                placeholderTextColor={Colors.$colorGray}
                                value={state.email}
                                onChangeText={str => dispatch({ type: 'email', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Contraseña</Text>
                            </View>
                            <View style={[styles.textInputWithImage, GlobalStyles.textInput]}>
                                <TextInput
                                    secureTextEntry={!showPassword}
                                    value={state.password}
                                    onChangeText={(payload) => dispatch({ type: 'password', payload })}
                                    placeholder="Contraseña"
                                    placeholderTextColor={Colors.$colorGray}
                                    style={styles.textInputCol}
                                />
                                <TouchableOpacity onPress={(e) => setShowPassword(!showPassword)} style={styles.touchableCol}>
                                    <Icon name={showPassword ? 'visibility-off' : 'visibility'} color={Colors.$colorYellow} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Repetir Contraseña</Text>
                            </View>
                            <View style={[styles.textInputWithImage, GlobalStyles.textInput]}>
                                <TextInput
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={value => setConfirmPassword(value)}
                                    placeholder="Contraseña"
                                    placeholderTextColor={Colors.$colorGray}
                                    style={styles.textInputCol}
                                />
                                <TouchableOpacity onPress={(e) => setShowConfirmPassword(!showConfirmPassword)} style={styles.touchableCol}>
                                    <Icon name={showConfirmPassword ? 'visibility-off' : 'visibility'} color={Colors.$colorYellow} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Codigo postal</Text>
                            </View>

                            <TextInput
                                style={GlobalStyles.textInput}
                                placeholder="Ingrese codigo postal aqui"
                                placeholderTextColor={Colors.$colorGray}
                                value={state.email}
                                onChangeText={str => dispatch({ type: 'email', payload: str })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.labelsRow}>
                                <Text style={styles.legendRow}>Dirección Física</Text>
                            </View>

                            <ViewAnimation style={[showModal ? styles.mapFullScreen : styles.mapContainer]} animations="fadeOut">

                                {
                                    (state.latitude !== null && state.longitude !== null) &&

                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            longitude: state.longitude,
                                            latitude: state.latitude,
                                            latitudeDelta: 0.050,
                                            longitudeDelta: 0.050
                                        }}
                                    // onMarkerDragEnd={ }
                                    >
                                        <Marker
                                            coordinate={{
                                                longitude: state.longitude,
                                                latitude: state.latitude,
                                            }}
                                            draggable={true}
                                        />

                                    </MapView>
                                }

                                <TouchableOpacity onPress={_ => setShowModal(!showModal)}>
                                    <Icon name={showModal ? 'fullscreen-exit' : 'fullscreen'} size={40} color={Colors.$colorYellow} />
                                </TouchableOpacity>
                            </ViewAnimation>
                        </View>

                        <View style={styles.row}>
                            <TouchableOpacity style={[GlobalStyles.buttonPrimary, styles.button]}>
                                <Text style={GlobalStyles.textButton}>GUARDAR</Text>
                            </TouchableOpacity>
                        </View>
                    </ViewAnimation>
                </View>
            </ScrollView>
        </Container >
    )

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    container: {
        backgroundColor: Colors.$colorBlack,
        alignItems: "center",
        paddingHorizontal: "5%",
        flexDirection: "column",
        justifyContent: "space-between",
        // flex: 1,
    },
    containerTitle: {
        flex: 1,
        padding: 10,
        marginLeft: 10
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
        fontSize: RFValue(16)
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableCol: {
        flex: 0.1,
        alignItems: 'flex-end',
    },
    textInputCol: {
        flex: 0.9,
        paddingLeft: 5,
        color: 'white',
    },
    rowPhoneNumber: {
        alignItems: "stretch",
        flexDirection: "row",
        marginTop: RFValue(5),
        width: '100%',
    },
    rowButtons: {
        alignItems: "center",
        // marginTop: 10,
        marginVertical: RFValue(25),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    position: {
        padding: 10
    },
    textBack: {
        color: Colors.$colorYellow,
        textTransform: "uppercase",
        fontSize: RFValue(16)
    },
    button: {
        marginTop: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        borderWidth: 2,
        borderColor: Colors.$colorYellow,
        borderRadius: 30,
    },
    mapFullScreen: {
        ...StyleSheet.absoluteFillObject,
        height: 500,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
})

export default RegisterCommerce