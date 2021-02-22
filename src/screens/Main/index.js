import React, { useEffect } from 'react'

// Import Views
import Payment from '../Payment/Payment'
import Send from '../Send/Send'
import History from '../History/History'
import Retirement from '../Retirement/Retirement'

// Import components
import Navbar from '../../components/Navbar/Navbar'
import { createStackNavigator } from '@react-navigation/stack'

// Import sotre from redux
import store from '../../store/index'
import { SETNAVIGATION } from '../../store/actionTypes'
import ModalVerification from '../../components/ModalVerification/ModalVerification'

const Stack = createStackNavigator()

const index = ({ navigation }) => {
    const { global } = store.getState()

    console.log('Storage', global)

    useEffect(() => {
        store.dispatch({ type: SETNAVIGATION, payload: navigation })
    }, [])

    return (
        <>
            {global.state === 2 ? <ModalVerification /> : null}
            <Stack.Navigator initialRouteName='Payment' headerMode={null}>
                <Stack.Screen name='Payment' component={Payment} />
                <Stack.Screen name='Send' component={Send} />
                <Stack.Screen name='History' component={History} />
                <Stack.Screen name='Retirements' component={Retirement} />
            </Stack.Navigator>

            <Navbar />
        </>
    )
}

export default index
