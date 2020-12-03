import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native'

// Import Component
import Modal from 'react-native-modal'
import Lottie from 'lottie-react-native'
import { isIphoneX } from "react-native-iphone-x-helper"
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors, deleteStorage } from '../../utils/constants.util'

// Import Storege
import storeRedux from '../../store/index'
import { DELETESTORAGE } from '../../store/actionTypes'

// Import Assets
import Logo from '../../assets/img/logo.png'
import more from '../../assets/img/more.png'
import Home from '../../animations/home.json'
import Transaction from '../../animations/transaction.json'
import LogOut from '../../animations/logout.json'

const NavBar = ({ config = {} }) => {
    const { logoSource, colorNavBar, backgroundMore, logoScale } = config

    const scale = logoScale ? logoScale : 1
    const navigation = useNavigation()

    const { global } = storeRedux.getState()

    const [showModal, setShowModal] = useState(false)

    const goToMain = () => {
        navigation.navigate("Main")
        setShowModal(false)
    }

    const goToTransaccion = () => {
        navigation.navigate("HistoryTransaction")
        setShowModal(false)
    }

    const logOut = async () => {
        await deleteStorage()

        storeRedux.dispatch({
            type: DELETESTORAGE
        })

        navigation.popToTop()
    }

    useEffect(() => {

        return () => setShowModal(false)
    }, [])

    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            backgroundColor: colorNavBar ? colorNavBar : "rgba(0, 0, 0, 0.5)",
            paddingHorizontal: 10,
            paddingTop: (Platform.OS === "ios" && isIphoneX()) ? RFValue(25) : 0,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between"
        },

        logo: {
            resizeMode: "contain",
            height: RFValue(60 * scale),
            width: RFValue(100 * scale),
        },

        buttonMore: {
            opacity: 1,
            borderRadius: 25,
            backgroundColor: backgroundMore ? backgroundMore : 'rgba(250, 250, 250, 0.2)',
            padding: 5,
        },

        imageMore: {
            resizeMode: "contain",
            height: RFValue(16)
        },

        containerModal: {
            backgroundColor: "rgba(0, 0, 0, 1)",
            marginTop: "8%",
            padding: 15,
            borderRadius: 10,
            width: "75%",
        },

        line: {
            borderBottomColor: Colors.$colorYellow,
            borderBottomWidth: 1,
            marginVertical: 10,
        },

        titleModal: {
            fontSize: RFValue(16),
            color: Colors.$colorYellow,
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
            height: RFValue(25),
            width: RFValue(25),
        },

        textCommingSoon: {
            // marginLeft: 10,
            color: "#FFF",
            fontSize: RFValue(10),
            padding: 5,
            borderRadius: 5,
            backgroundColor: Colors.$colorRed,
            position: "absolute",
            right: 0,
        }
    })

    const logged = (Object.values({ ...global }).length > 0)
    return (
        <>
            <View style={styles.container}>
                <Image source={logoSource ? logoSource : Logo} style={styles.logo} />

                <TouchableOpacity style={styles.buttonMore} onPress={_ => setShowModal(true)}>
                    <Image source={more} style={styles.imageMore} />
                </TouchableOpacity>
            </View>

            <Modal
                animationOut="fadeOutDown"
                backdropOpacity={0}
                style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}
                isVisible={showModal}
                onBackdropPress={_ => { setShowModal(false), console.log('Hola puto') }}
                onBackButtonPress={_ => setShowModal(false)}
            >
                <View style={styles.containerModal}>
                    {
                        logged &&
                        <>
                            <TouchableOpacity onPress={goToMain} style={styles.selectionMenu}>
                                <Lottie style={styles.imageItem} source={Home} autoPlay loop={false} />

                                <Text style={styles.textSelection}>Ir a Inicio</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={goToTransaccion} style={styles.selectionMenu}>
                                <Lottie style={styles.imageItem} source={Transaction} autoPlay loop={false} />

                                <Text style={styles.textSelection}>Transacciones</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={logOut} style={styles.selectionMenu}>
                                <Lottie style={styles.imageItem} source={LogOut} autoPlay loop={false} />

                                <Text style={styles.textSelection}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </Modal>
        </>
    )
}
export default NavBar