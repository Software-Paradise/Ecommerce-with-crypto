import React, { useState } from 'react'

import { GlobalStyles, RFValue } from '../../utils/constants.util'

// Import Component
<<<<<<< Updated upstream
import { SafeAreaView } from 'react-native'
=======
import { SafeAreaView, Image, StyleSheet, ScrollView, View, RefreshControl } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
>>>>>>> Stashed changes
import NavBar from '../Navbar/Navbar'

// Import assents
import logo from '../../assets/img/logo.png'

const Container = ({ children, showLogo = false, scrollViewStyles = {}, onRefreshEnd = null }) => {
    const [refreshing, setRefrishing] = useState(false)

    /**Metodo para recargar pantalla */
    const refetching = async () => {
        try {
            setRefrishing(true)

            await onRefreshEnd()

            setRefrishing(false)
        } catch (error) {
        }
    }

    return (
<<<<<<< Updated upstream

        < SafeAreaView style={GlobalStyles.superContainer} >
            {/* {
                    !hideNavbar &&
                    <NavBar config={navBarConfig} />
                } */}
            { children}
            {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                </KeyboardAvoidingView> */}
        </SafeAreaView >
=======
        <SafeAreaView style={GlobalStyles.superContainer}>
            <ScrollView
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps='always'
                refreshControl={onRefreshEnd != null && <RefreshControl refreshing={refreshing} onRefresh={refetching} />}
                style={[styles.scroll, scrollViewStyles]}
            >
                {
                    showLogo !== false &&
                    <Image style={styles.logo} source={logo} />
                }

                {
                    children
                }

                <View style={{height:RFValue(60)}} />
            </ScrollView>
        </SafeAreaView>

>>>>>>> Stashed changes
    )
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        position: 'relative'
    },
    logo: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: RFValue(128),
        width: '80%'
    }
})

export default Container