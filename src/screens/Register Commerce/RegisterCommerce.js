import React, { useState, useEffect, useRoute, useReducer } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import { Image, View as ViewAnimation } from 'react-native-animatable'
import Loader from '../../components/Loader/Loader'
import { Colors, RFValue,showNotification, http, serverAddress, getHeaders } from '../../utils/constants.util'
import { GlobalStyles } from '../../styles/global.style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MapView, { Marker } from 'react-native-maps'
import GeoLocation from 'react-native-location'

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

    // const route = useRoute();

    // Estados que permiten previsualizar las contraseñas
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
})

export default RegisterCommerce