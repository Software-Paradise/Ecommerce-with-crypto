import React, { useEffect } from 'react'

// Import Components
import { createStackNavigator } from '@react-navigation/stack'

// Import Views
import Payment from '../../components/Payment/Payment'
import Send from '../../components/Send/Send'
import History from '../../components/History/History'


// Import components
import Navbar from '../../components/Navbar/Navbar'

// Import sotre from redux
import store from '../../store/index'
import { SETNAVIGATION } from '../../store/actionTypes'

const Stack = createStackNavigator()

const index = ({ navigtion }) => {
    useEffect(() => {
        store.dispatch({ type: SETNAVIGATION, payload: navigtion })
    }, [])

    return (
        <>
            <Stack.Navigator initialRouteName='Payment' headerMode={null}>
                <Stack.Screen name='Payment' component={Payment} />
                <Stack.Screen name='Send' component={Send} />
                <Stack.Screen name='History' component={History} />
            </Stack.Navigator>

            <Navbar />
        </>
    )
}

export default index
