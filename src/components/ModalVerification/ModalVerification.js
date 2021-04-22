import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

// Import Components
import { Colors, RFValue, GlobalStyles, logOutApp } from '../../utils/constants.util'
import Modal from 'react-native-modal'

// Import Assets
import Logo from '../../assets/img/logo.png'
import funko from '../../assets/img/AlyFunko2.png'

// Import redux
import store from '../../store/index'
import { DELETESTORAGE } from '../../store/actionTypes'

const ModalVerification = () => {

    const logOut = async () => {
        try {
            await logOutApp()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal isVisible={true} >
            <View style={styles.containerModal}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={Logo} style={styles.logo} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                        <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(15) }}>Tu cuenta aún no está verificada</Text>
                    </View>
                    <Image style={styles.logoFunko} source={funko} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <View style={styles.row}>
                        <Text style={{ color: Colors.$colorYellow, fontSize: RFValue(15), textAlign: 'justify' }}>Debes esperar a que su cuenta sea verificada por nuestro equipo para poder disfrutar de la aplicación</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', padding: 20 }}>
                    <TouchableOpacity onPress={logOut} style={GlobalStyles.buttonPrimary}>
                        <Text style={GlobalStyles.textButton}>cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    containerModal: {
        alignSelf: "center",
        backgroundColor: Colors.$colorBlack,
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
    logoFunko: {
        resizeMode: "contain",
        height: RFValue(170),
        width: RFValue(270),
    },
    row: {
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
    },

})

export default ModalVerification