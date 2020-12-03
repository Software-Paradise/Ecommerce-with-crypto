import React from 'react'

import { GlobalStyles } from '../../styles/global.style'

// Import Component
import { SafeAreaView, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import NavBar from '../Navbar/Navbar'

const Container = ({ children, hideNavbar, navBarConfig = {} }) => {
    return (
        <LinearGradient colors={['#172427', '#191e1f']} style={GlobalStyles.superContainer} >
            {
                !hideNavbar &&
                <NavBar config={navBarConfig} />
            }

            <SafeAreaView style={GlobalStyles.superContainer}>
                {children}
                {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                </KeyboardAvoidingView> */}
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Container