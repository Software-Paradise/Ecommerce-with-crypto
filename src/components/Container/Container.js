import React from 'react'

import { GlobalStyles, RFValue } from '../../utils/constants.util'

// Import Component
import { SafeAreaView } from 'react-native'
import NavBar from '../Navbar/Navbar'

const Container = ({ children, showLogo = false, scrollViewStyles = {}, onRefreshEnd = null }) => {

    return (

        <SafeAreaView style={GlobalStyles.superContainer} >
            {/* {
                    !hideNavbar &&
                    <NavBar config={navBarConfig} />
                } */}
            { children}
            {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                </KeyboardAvoidingView> */}
        </SafeAreaView >
    )
}

export default Container