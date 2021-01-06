import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from "react-native"
import Login from './src/screens/Login/Login';
import RegisterScreen from './src/screens/Register/Register';
import LegalDataScreen from './src/screens/legaldata.screen';
import LegalImagesScreen from './src/screens/legalimages.screen';
import WelcomeScreen from './src/screens/welcome.screen';
import RegisterCommerceScreen from './src/screens/Register Commerce/RegisterCommerce';
import CommerceList from './src/screens/commerce-list.screen';
import ProductList from './src/screens/product-list.screen';
import MainScreen from './src/screens/Main/index';

// Import functions and constants from utils
import { getStorage } from './src/utils/constants.util';
import { SETSTORAGE, DELETESTORAGE } from './src/store/actionTypes';
import reduxStore from './src/store/index';
import FlashMessage from 'react-native-flash-message';
import TransactionScreen from './src/screens/transaction.screen';
import RetirementsScreen from './src/screens/Retirement/Retirement';
import RechargeScreen from './src/screens/recharge.screen';
import HistoryScreen from './src/components/History/History'

// Import Componets
import Description from './src/components/Description/Description'

const Stack = createStackNavigator();

const App = () => {
  const [logged, setLogin] = useState(false)

  const ConfigurateComponent = async () => {
    const payload = await getStorage()

    if (Object.keys(payload).length > 0) {

      reduxStore.dispatch({
        type: SETSTORAGE,
        payload
      })

      setLogin(true)

    } else {
      setLogin(false)

      reduxStore.dispatch({ type: DELETESTORAGE })
    }

    reduxStore.subscribe(_ => {

      const { global } = reduxStore.getState()

      if (Object.keys(global).length > 0) {
        setLogin(true)
      } else {
        setLogin(false)
      }
    })
  }

  useEffect(() => {
    // ConfigureLocation()
    ConfigurateComponent()
  }, [])

  return (
    <>
      <StatusBar translucent={true} hidden={true} />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {
            logged &&
            <>
              <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Recharge" component={RechargeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CommerceList" component={CommerceList} options={{ headerShown: false }} />
              <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
              <Stack.Screen name="Transaction" component={TransactionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="HistoryTransaction" component={HistoryScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Description" component={Description} options={{ headerShown: false }} />
            </>
          }

          {!logged && (
            <>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LegalData" component={LegalDataScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LegalImages" component={LegalImagesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterCommerce" component={RegisterCommerceScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage floating={true} position="top" />
    </>
  );
};

export default App;
