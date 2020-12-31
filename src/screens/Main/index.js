import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

// Import Views
import Recharge from '../recharge.screen'
import Retirements from '../Retirement/Retirement'
import History from '../../components/History/History'
import Payment from '../../components/Payment/Payment';

// Import constans
import { Colors } from '../../utils/constants.util'

// Import Assents
import Facturar from '../../assets/img/facturar.png'

const Tab = createMaterialBottomTabNavigator()

const Router = () => {
    return (
        <Tab.Navigator initialRouteName="Payment"
            barStyle={{ backgroundColor: Colors.$colorMain }}
            activeColor={Colors.$colorYellow}
        >
            <Tab.Screen name="Payment" component={Payment}
                options={{
                    tabBarLabel: 'Facturar',
                    tabBarIcon: ({ }) => (
                        <Image source={Facturar} style={styles.icon} />
                    )
                }}
            />
            <Tab.Screen name="Retirements" component={Retirements} options={{ headerShown: false }} />
            <Tab.Screen name="HistoryTransaction" component={History} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    icon: {
        width:25,
        height:25,
    }
})

export default Router
