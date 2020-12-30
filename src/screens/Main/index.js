import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Import Views
import Main from '../Main/Main'
import Recharge from '../recharge.screen'
import Retirements from '../Retirement/Retirement'
import History from '../../components/History/History'


const Tab = createBottomTabNavigator()

const Router = () => {
    return (

        <Tab.Navigator initialRouteName="Login" screenOptions={{}}>
            <Tab.Screen name="Main" component={Main} options={{ headerShown: false }} />
            <Tab.Screen name="Retirements" component={Retirements} options={{ headerShown: false }} />
            <Tab.Screen name="HistoryTransaction" component={History} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

export default Router
