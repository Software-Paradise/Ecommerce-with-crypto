import React from 'react'

import { GlobalStyles } from '../../styles/global.style'

// Import Component
import { SafeAreaView } from 'react-native'
import NavBar from '../Navbar/Navbar'

const Container = ({ children, hideNavbar, navBarConfig = {} }) => {
    return (

        < SafeAreaView style={GlobalStyles.superContainer} >
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