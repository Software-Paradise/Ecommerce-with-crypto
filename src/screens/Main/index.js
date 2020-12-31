import React, { useEffect } from 'react'
import { Image, StyleSheet, View, Linking } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

// Import Views
import Recharge from '../recharge.screen'
import Send from '../../components/Send/Send'
import History from '../../components/History/History'
import Payment from '../../components/Payment/Payment';

// Import constans
import { Colors, RFValue, deleteStorage } from '../../utils/constants.util'

// Import Assents
import Facturar from '../../assets/img/facturar.png'
import Enviar from '../../assets/img/enviar.png'
import Historial from '../../assets/img/history.png'
import Salir from '../../assets/img/exit.png'
import Suport from '../../assets/img/support.png'

// Import Storege
import storeRedux from '../../store/index'
import { DELETESTORAGE, SETFUNCTION } from '../../store/actionTypes'

const Tab = createMaterialBottomTabNavigator()

// Funcion que permite desloquearse
const logOut = ({ navigation }) => {

    const logOut = async () => {
        await deleteStorage()

        storeRedux.dispatch({
            type: DELETESTORAGE
        })

        navigation.popToTop()
    }

    useEffect(() => {
        logOut()
    }, [])

    return (
        <View></View>
    )
}

const OpenSupport = () => Linking.openURL('https://wa.me/+50660727720')

const Router = () => {
    return (
<<<<<<< HEAD
        <Tab.Navigator initialRouteName="Payment"
            barStyle={{ backgroundColor: Colors.$colorBlack }}
=======
        <Tab.Navigator initialRouteName="Retirements"
            barStyle={{ backgroundColor: Colors.$colorMain }}
>>>>>>> 66c7b965794d480cd3bb908604547627e55429f6
            activeColor={Colors.$colorYellow}
            inactiveColor={Colors.$colorYellow}
        >
            <Tab.Screen name="Payment" component={Payment}
                options={{
                    tabBarLabel: 'Facturar',
                    tabBarIcon: () => (
                        <Image source={Facturar} style={styles.icon} />
                    )
                }}
            />
            <Tab.Screen name="Send" component={Send} options={{
                tabBarLabel: 'Enviar',
                tabBarIcon: () => (
                    <Image source={Enviar} style={styles.icon} />
                )
            }} />

            <Tab.Screen name="HistoryTransaction" component={History} options={{
                tabBarLabel: 'Historial',
                tabBarIcon: () => (
                    <Image source={Historial} style={styles.icon} />
                )
            }} />

            <Tab.Screen name="suport" component={OpenSupport} options={{
                tabBarLabel: 'Soporte',
                tabBarIcon: () => (
                    <Image source={Suport} style={styles.icon} />
                )
            }} />

            <Tab.Screen name="logOut" component={logOut} options={{
                tabBarLabel: 'Salir',
                tabBarIcon: () => (
                    <Image source={Salir} style={styles.icon} />
                )
            }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
    }
})

export default Router
