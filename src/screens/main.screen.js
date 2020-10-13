import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GlobalStyles} from '../styles/global.style';
import PaymentScreen from './payment.screen';
import TransactionScreen from './transaction.screen';

const Drawer = createDrawerNavigator();

const MainScreen = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name='Payment' component={PaymentScreen}/>
            <Drawer.Screen name='Transaction' component={TransactionScreen}/>
        </Drawer.Navigator>
    )
};

export default MainScreen;
