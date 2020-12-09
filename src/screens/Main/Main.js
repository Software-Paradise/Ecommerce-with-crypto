import React, { useState, useEffect, useReducer } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import Switch from '../../components/Switch/Switch'
import PayComponent from '../../components/Payment/Payment'
import SendComponent from '../../components/Send/Send'

// Import constants
import { Colors, RFValue, reducer } from '../../utils/constants.util'


const TYPE_VIEW = {
    PAY: 'pay',
    SEND: 'send',
    RECEIVE: 'receive',
}

const switchItems = [
    {
        text: 'Facturar',
        state: TYPE_VIEW.PAY,
    },
    {
        text: 'Enviar',
        state: TYPE_VIEW.SEND,
    },
    {
        text: 'Recibir',
        state: TYPE_VIEW.RECEIVE,
    }
]

const initialState = {
    indexActive: 0,
}

const Main = () => {
    const [stateView, setStateView] = useState(TYPE_VIEW.PAY)
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <Container showLogo>
            <View style={styles.container}>
                <Switch onSwitch={setStateView} items={switchItems} indexActive={state.idexTabActive} />
                <KeyboardAvoidingView enabled behavior='padding' style={styles.containerWallets}>
                    {
                        stateView === TYPE_VIEW.PAY &&
                        <PayComponent />
                    }

                    {
                        stateView === TYPE_VIEW.SEND &&
                        <SendComponent />
                    }
                </KeyboardAvoidingView>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.$colorMain
    },
    containerWallets: {
        backgroundColor: Colors.$colorBlack,
        marginHorizontal: RFValue(10),
    }
})

export default Main