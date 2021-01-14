import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Views
import Login from './src/screens/Login/Login';
import RegisterScreen from './src/screens/Register/Register';
import RegisterCommerceScreen from './src/screens/Register Commerce/RegisterCommerce';
import MainScreen from './src/screens/Main/index';
import TransactionScreen from './src/screens/Transaction/transaction.screen';

// Import functions and constants from utils
import { getStorage, socketAddress } from './src/utils/constants.util';
import { SETSTORAGE, DELETESTORAGE } from './src/store/actionTypes';
import reduxStore from './src/store/index';
import FlashMessage from 'react-native-flash-message';

// Import Componets
import Description from './src/components/Description/Description'
import socketIO from 'socket.io-client'
import store from './src/store/index';

const Stack = createStackNavigator();

const App = () => {
  const { global } = store.getState()
  const [logged, setLogin] = useState(false)

  const ConfigurateComponent = useCallback(async () => {
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
  }, [])

  /**Funcion que actualiza el storage con el nuevo balance del comercio */
  const udpdateWalletAmount = (data) => {
    const { global: Storage } = store.getState()

    const dataStorage = {
      ...Storage,
      info: {
        ...Storage.info,
        amount_wallet: data.balance
      }
    }
    store.dispatch({ type: SETSTORAGE, payload: dataStorage })
  }

  /**Funcion que conecta al socket para obtener el balance del comercio */
  const Connection = _ => {
    const socket = socketIO(socketAddress, {
      path: '/socket-user',
      query: {
        token: global.token,
      },
      forceNew: true,
      transports: ['websocket']
    })

    socket.on('connect', () => {
      console.log('Conectado')
    })

    socket.on('BALANCEREFRESH', udpdateWalletAmount)
  }

  useEffect(() => {
    ConfigurateComponent()
  }, [])

  useEffect(() => {
    if (logged) {
      Connection()
    }
  }, [logged])

  return (
    <>
      <StatusBar translucent={true} hidden={true} />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {
            logged &&
            <>
              <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Transaction" component={TransactionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Description" component={Description} options={{ headerShown: false }} />
            </>
          }

          {!logged && (
            <>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
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
