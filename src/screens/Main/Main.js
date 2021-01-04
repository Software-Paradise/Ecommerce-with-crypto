import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, Image } from 'react-native'

// Import Component
import Container from '../../components/Container/Container'
import Switch from '../../components/Switch/Switch'
import PayComponent from '../../components/Payment/Payment'
import SendComponent from '../../components/Send/Send'
import History from '../../components/History/History'
import Card from '../../components/CardProfile/CardProfile'

// import constants
import { RFValue } from '../../utils/constants.util'

// import assets
import Logo from "../../assets/img/logo.png"

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

const Main = () => {
    const [stateView, setStateView] = useState(TYPE_VIEW.PAY)

    return (
        <Container showLogo>
            <KeyboardAvoidingView enabled>
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
            </KeyboardAvoidingView>
        </Container>
    )
}

export default Main