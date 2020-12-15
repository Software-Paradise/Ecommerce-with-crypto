import React, { useState, useEffect, useCallback } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
    Dimensions,
    ScrollView,
    Linking,
    Alert,
} from 'react-native'
import { GlobalStyles } from '../styles/global.style'
import LogoHeaderComponent from '../components/logoheader.component'
import { Colors, errorMessage } from '../utils/constants.util'
import FooterComponent from '../components/footer.component'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { registerStyles } from './register.screen'
import MapView, { Marker } from 'react-native-maps'
import GeoLocation from 'react-native-location'
import ButtonWithIcon from '../components/button-with-icon.component'
import ButtonSupport from '../components/buttonsupport.component'
import { SafeAreaView } from 'react-native-safe-area-context'
import { http } from './../utils/constants.util'
import { useRoute } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import { PERMISSIONS, request } from 'react-native-permissions'
import { RFValue } from 'react-native-responsive-fontsize'


const RegisterCommerceScreen = ({ navigation }) => {
    const route = useRoute()
    const [showPassword, setShowPassword] = useState(false)
    const [commerceName, setCommerceName] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [location, setLocation] = useState(null)

    const getRegionCoords = (lat, lng, distance) => {
        distance = distance / 2
        const circumference = 40075
        const oneDegreeOfLatitudeInMeters = 111.32 * 1000
        const angularDistance = distance / circumference

        const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
        const longitudeDelta = Math.abs(
            Math.atan2(
                Math.sin(angularDistance) * Math.cos(lat),
                Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat),
            ),
        )

        return ({
            latitude: lat,
            longitude: lng,
            latitudeDelta,
            longitudeDelta,
        })
    }

    const _handleSubmit = async () => {
        try {
            if (commerceName === '') {
                errorMessage('Nombre de comercio requerido')
            } else if (zipCode === '') {
                errorMessage('Codigo postal requerido')
            } else if (email === '') {
                errorMessage('Correo electronico requerido')
            } else if (password === '') {
                errorMessage('Contraseña requerida')
            } else {
                const commerceData = {
                    username: commerceName.trim().toLowerCase(),
                    email: email,
                    password: password,
                    commerceType: 2,
                    description: commerceName,
                    idCompany: route.params.companyId,
                    emailCommerce: email,
                    phoneCommerce: 0,
                    physicalAddress: 'Managua',
                    latitude: location.latitude,
                    longitude: location.longitude,
                }

                const { data } = await http.post(
                    '/ecommerce/company/commerce',
                    commerceData,
                )

                if (data.error) {
                    errorMessage(data.message)
                }

                showMessage({
                    message: 'Exito',
                    description: 'Tu comercio se ha creado con exito',
                    type: 'success',
                })

                navigation.navigate('Login')
            }
        } catch (e) {
            errorMessage(e.message)
        }
    }


    /**
     * funcion que alerta al usuario de los permisos de ubicacions
     */
    const aletPermissionsDecline = useCallback(() => {
        Alert.alert(
            "Permisos de ubicación",
            "AlyPay no ha podido procesar tu ubicación",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                    onPress: () => showMessage({
                        icon: "warning",
                        backgroundColor: Colors.$colorRed,
                        message: "Error en ubicacion",
                        description: "Para continuar deberá de activar su ubicación",
                        onLongPress: () => Linking.openSettings()
                    })
                },
                {
                    text: "Abrir Preferencias",
                    style: "destructive",
                    onPress: () => {
                        Linking.openSettings()
                    }
                }
            ]
        )
    }, [])

    const GetGPSLocation = useCallback(async () => {
        await GeoLocation.configure({
            distanceFilter: 5.0,
            desiredAccuracy: {
                ios: 'best',
                android: 'balancedPowerAccuracy',
            },
            allowsBackgroundLocationUpdates: false,
        })

        try {
            // Verificamos si el dispositivo tiene permisos para GPS
            const checkPerm = await GeoLocation.checkPermission({
                ios: 'whenInUse',
                android: {
                    detail: 'coarse',
                },
            })

            // Verifica si no hay permisos
            if (!checkPerm) {
                // pedir permisos
                const permGranted = await GeoLocation.requestPermission({
                    ios: 'whenInUse',
                    android: {
                        detail: "coarse"
                    }
                })


                // El usuario no permitio
                if (!permGranted) {
                    aletPermissionsDecline()
                }
            }

            const gps = await GeoLocation.getLatestLocation({ timeout: 5000 })

            // verificamos si la ubicacion es nulla
            if (gps === null) {
                aletPermissionsDecline()
            }
            // console.log(gps)
            setLocation(gps)
            // GeoLocation.getLatestLocation({timeout: 1000}).then(setLocation)

        } catch (error) {
            errorMessage(error.toString())
        }
    }, [])

    useEffect(() => {
        GetGPSLocation()
    }, [])

    return (
        <SafeAreaView style={GlobalStyles.superContainer}>
            <ScrollView>
                <View style={RegisterCommerceStyles.container}>
                    <LogoHeaderComponent title="Registro de comercio" />

                    <View style={RegisterCommerceStyles.form}>
                        <View style={RegisterCommerceStyles.formControl}>
                            <Text style={registerStyles.inputLabel}>Nombre de comercio</Text>
                            <View style={registerStyles.textInputWithImage}>
                                <Icon name="store" size={18} color={Colors.$colorGray} />
                                <TextInput
                                    placeholder="Nombre de comercio"
                                    placeholderTextColor={Colors.$colorGray}
                                    value={commerceName}
                                    onChangeText={(value) => setCommerceName(value)}
                                    style={registerStyles.textInputCol}
                                />
                                <View style={registerStyles.touchableCol} />
                            </View>
                        </View>

                        <View style={RegisterCommerceStyles.formControl}>
                            <Text style={registerStyles.inputLabel}>Código postal</Text>
                            <View style={registerStyles.textInputWithImage}>
                                <Icon name="location-on" color={Colors.$colorGray} size={18} />
                                <TextInput
                                    placeholder="Código postal"
                                    value={zipCode}
                                    onChangeText={(value) => setZipCode(value)}
                                    placeholderTextColor={Colors.$colorGray}
                                    style={registerStyles.textInputCol}
                                />
                                <View style={registerStyles.touchableCol} />
                            </View>
                        </View>

                        <View style={RegisterCommerceStyles.formControl}>
                            <Text style={registerStyles.inputLabel}>Correo electrónico</Text>
                            <View style={registerStyles.textInputWithImage}>
                                <Icon name="email" size={18} color={Colors.$colorGray} />
                                <TextInput
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChangeText={(value) => setEmail(value)}
                                    placeholderTextColor={Colors.$colorGray}
                                    style={registerStyles.textInputCol}
                                />
                                <View style={registerStyles.touchableCol} />
                            </View>
                        </View>

                        <View style={RegisterCommerceStyles.formControl}>
                            <Text style={registerStyles.inputLabel}>Contraseña</Text>
                            <View style={registerStyles.textInputWithImage}>
                                <Icon name="lock" color={Colors.$colorGray} size={18} />
                                <TextInput
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(value) => setPassword(value)}
                                    placeholder="Contraseña"
                                    placeholderTextColor={Colors.$colorGray}
                                    style={registerStyles.textInputCol}
                                />
                                <TouchableOpacity
                                    onPress={(e) => setShowPassword(!showPassword)}
                                    style={GlobalStyles.touchableCol}>
                                    <Icon
                                        name={showPassword ? 'visibility-off' : 'visibility'}
                                        color={Colors.$colorYellow}
                                        size={18}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={RegisterCommerceStyles.formControl}>
                            <Text style={registerStyles.inputLabel}>
                                Verificar contraseña
                            </Text>

                            <View style={registerStyles.textInputWithImage}>
                                <Icon name="lock" color={Colors.$colorGray} size={18} />
                                <TextInput
                                    secureTextEntry={!showPassword}
                                    placeholder="Repita su contraseña"
                                    value={confirmPassword}
                                    onChangeText={(value) => setConfirmPassword(value)}
                                    placeholderTextColor={Colors.$colorGray}
                                    style={registerStyles.textInputCol}
                                />
                                <TouchableOpacity
                                    onPress={(e) => setShowPassword(!showPassword)}
                                    style={GlobalStyles.touchableCol}>
                                    <Icon
                                        name={showPassword ? 'visibility-off' : 'visibility'}
                                        color={Colors.$colorYellow}
                                        size={18}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={RegisterCommerceStyles.smallSpacing}>
                            <Text style={registerStyles.inputLabel}>Dirección Física</Text>
                        </View>

                        
                        
                        <View style={RegisterCommerceStyles.mapContainer}>
                            {
                                (location !== null) &&
                                <MapView
                                    style={RegisterCommerceStyles.map}
                                    
                                    initialRegion={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                        latitudeDelta: 0.050,
                                        longitudeDelta: 0.050,
                                    }}
                                    onPress={event => {
                                        setLocation({
                                            latitude: event.nativeEvent.coordinate.latitude,
                                            longitude: event.nativeEvent.coordinate.longitude,
                                        })
                                    }}>
                                    <Marker
                                        coordinate={{
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                        }}
                                        pinColor={Colors.$colorYellow}
                                        id="commerce-location"
                                        zIndex={9999}
                                    />
                                </MapView>
                            }
                        </View>
                        
                        <View
                            style={{
                                ...RegisterCommerceStyles.row,
                                ...RegisterCommerceStyles.spacing,
                            }}>
                            <ButtonWithIcon
                                onPress={_handleSubmit}
                                text="REGISTRAR"
                                icon="store"
                                type="filled"
                            />
                        </View>
                        <FooterComponent />
                    </View>
                </View>
            </ScrollView>
            <ButtonSupport />
        </SafeAreaView>
    )
}

const RegisterCommerceStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
    },
    spacing: {
        paddingVertical: 25,
    },
    smallSpacing: {
        paddingVertical: 10,
    },
    column: {
        flex: 0.5,
    },
    inputLabel: {
        color: Colors.$colorYellow,
        fontSize: 15,
    },
    form: {
        paddingVertical: 25,
    },
    formControl: {
        marginVertical: RFValue(10)
    },
    markerImage: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    textInputWithImage: {
        ...GlobalStyles.textInput,
        flexDirection: 'row',
    },
    textInputCol: {
        flex: 0.9,
    },
    touchableCol: {
        flex: 0.1,
        alignItems: 'flex-end',
    },
    supportContainer: {
        alignItems: 'center',
        paddingRight: 25,
        height: 50,
        width: 50,
        alignSelf: 'flex-end',
    },
    whatsappOpacity: {
        height: 100,
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        height: RFValue(256),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
    },
    mapFullScreen: {
        height: 500,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    fullScreenButton: {
        backgroundColor: 'white',
        padding: 5,
        margin: 10,
        borderRadius: 5,
    },
})

export default RegisterCommerceScreen
