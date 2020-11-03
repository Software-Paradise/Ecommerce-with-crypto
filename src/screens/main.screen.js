import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAvoidingView, ScrollView, Text, View, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GlobalStyles} from '../styles/global.style';
import PaymentScreen from './payment.screen';
import TransactionScreen from './transaction.screen';
import HistoryScreen from './history.screen';
import {switchItems, TYPE_VIEW} from '../utils/constants.util';
import Switch from '../components/switch.component';
import { Colors } from './../utils/constants.util';

// const Drawer = createDrawerNavigator();

const MainScreen = () => {
  const [stateView, setStateView] = useState(TYPE_VIEW.ORDER);

  return (
    <View style={styles.container}>
      <Switch onSwitch={setStateView} items={switchItems} />
      <KeyboardAvoidingView enabled behavior="padding">
        {stateView === TYPE_VIEW.ORDER && <PaymentScreen />}

        {stateView === TYPE_VIEW.HISTORY && <HistoryScreen />}
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.$colorMain,
    },
});

export default MainScreen;
