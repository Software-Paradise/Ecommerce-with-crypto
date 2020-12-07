import React, { useState, useEffect, useRoute } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import { Image, View as ViewAnimation } from 'react-native-animatable'
import Loader from '../../components/Loader/Loader'
import { Colors, showNotification, http, serverAddress, getHeaders } from '../../utils/constants.util'
import { GlobalStyles } from '../../styles/global.style'
import { RFValue } from 'react-native-responsive-fontsize';

// Import Assets
import Logo from '../../assets/img/logo.png'


const RegisterCommerce = () => {
    const [loader, setLoader] = useState(false)
    return (
        <Container hideNavbar >
            <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={Logo} />

                    <Loader isVisible={loader} />

                    <ViewAnimation style={[styles.tab, { paddingBottom: RFValue(20) }]} animations="fadeIn" >

                    </ViewAnimation>
                </View>
            </ScrollView>
        </Container>
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
        flex: 1,
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
})

export default RegisterCommerce