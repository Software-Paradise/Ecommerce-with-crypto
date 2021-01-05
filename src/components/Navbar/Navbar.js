import React, { useState, useEffect } from 'react'

// Import components
import Icon from 'react-native-vector-icons/AntDesign'
import { StyleSheet, View, TouchableOpacity, Keyboard, Image, Platform, Alert, Text } from 'react-native'
import { BlurView } from "@react-native-community/blur"

// Import funtions and constanst
import { RFValue, logOutApp, OpenSupport, Colors } from '../../utils/constants.util'
import { useNavigation, StackActions } from '@react-navigation/native'

// Import Assets
import Facturar from '../../assets/img/facturar.png'
import Enviar from '../../assets/img/enviar.png'
import Historial from '../../assets/img/history.png'
import Support from '../../assets/img/support.png'
import Exit from '../../assets/img/exit.png'

iconSize = RFValue(32)

const Navbar = () => {
    const [hidden, setHidden] = useState(false)
    const { dispatch, navigate } = useNavigation()

    const toggleMenu = () => {
        Alert.alert("Cerrar Sesion", "Esta apunto de cerrar sesion en Alypay Ecommerce", [
            {
                text: "Cancelar",
                onPress: () => { }
            },
            {
                text: "Cerrar Sesion",
                onPress: logOut
            }
        ])
    }

    const goToTop = () => {
        try {
            dispatch(StackActions.popToTop())
        } catch (error) {
            console.log(error)
        }
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
        navigate('Send')
    }

    const onHistory = () => {
        navigate('History')
    }

    useEffect(() => {
        // Ocultamos el menu cuando el teclado se active
        const eventShowKeyboard = Keyboard.addListener('keyboardDidShow', () => setHidden(true))

        // Mostramos el menu cuando el teclado se oculte
        const eventHideKeyboard = Keyboard.addListener('keyboardDidHide', () => setHidden(false))

        return () => {
            // Removemos los eventos cuando el componente se desmonte
            eventShowKeyboard.remove()
            eventHideKeyboard.remove()
        }
    }, [])

    if (!hidden) {
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <BlurView style={styles.absolute} blurType="dark" />

                    <View style={styles.containerButtons}>

                        <TouchableOpacity onPress={goToTop} style={styles.button}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={Facturar} style={styles.imageProfile} />
                                <Text style={styles.legend}>Facturar</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onSend} style={styles.button}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={Enviar} style={styles.imageProfile} />
                                <Text style={styles.legend}>Enviar</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onHistory} style={styles.button}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={Historial} style={styles.imageProfile} />
                                <Text style={styles.legend}>Historial</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={OpenSupport} style={styles.button}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={Support} style={styles.imageProfile} />
                                <Text style={styles.legend}>Soporte</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleMenu} style={styles.button}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={Exit} style={styles.imageProfile} />
                                <Text style={styles.legend}>Salir</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {
                        Platform.OS === "ios" &&
                        <View style={{ height: 20 }} />
                    }
                </View>
            </View>
        )
    } else {
        return null
    }
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
        ...StyleSheet.absoluteFillObject
    },

    subContainer: {
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
        alignSelf: "center",
        flexDirection: "row",
        padding: RFValue(10),
        flex: 1,
    },

    imageProfile: {
        borderRadius: iconSize * 2,
        resizeMode: "contain",
        width: iconSize,
        height: iconSize,
    },
    legend: {
        color: Colors.$colorYellow,
        fontSize: RFValue(13)
    },
})

export default Navbar