import React, { useState, useReducer } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import Switch from '../../components/Switch/Switch'
import PayComponent from '../../components/Payment/Payment'
import SendComponent from '../../components/Send/Send'
import History from '../../components/History/History'
import Card from '../../components/CardProfile/CardProfile'
import Loader from '../../components/Loader/Loader'

// Import constants
import { Colors, reducer, RFValue } from '../../utils/constants.util'

const TYPE_VIEW = {
    PAY: 'pay',
    SEND: 'send',
    HISTORY: 'history',
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
        text: 'Historial',
        state: TYPE_VIEW.HISTORY,
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
            {/* <Loader isVisible={true} /> */}
            <KeyboardAvoidingView enabled  >
                <ScrollView>
                    <Card />
                    <Switch onSwitch={setStateView} items={switchItems} indexActive={state.idexTabActive} />
                    {
                        stateView === TYPE_VIEW.PAY &&
                        <PayComponent />
                    }

                    {
                        stateView === TYPE_VIEW.SEND &&
                        <SendComponent />
                    }

                    {
                        stateView === TYPE_VIEW.HISTORY &&
                        <History />
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.$colorMain
    },
})

export default Main