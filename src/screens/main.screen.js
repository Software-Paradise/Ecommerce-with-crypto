import React, {useState} from 'react';
import {KeyboardAvoidingView, Image, View, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import PaymentScreen from './payment.screen';
import HistoryScreen from './history.screen';
import {switchItems, TYPE_VIEW} from '../utils/constants.util';
import Switch from '../components/switch.component';
import { Colors } from './../utils/constants.util';

// const Drawer = createDrawerNavigator();

const MainScreen = () => {
  const [stateView, setStateView] = useState(TYPE_VIEW.ORDER);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image source={require('./../assets/img/logo.png')} style={styles.logo}/>
      </View>
      
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
    logo: {
      alignContent: "center",
      resizeMode: "contain",
      height: RFValue(128),
      width: RFValue(256),
    }
});

export default MainScreen;
