import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from "react-native"

// Import Views
import Login from './src/screens/Login/Login';
import RegisterScreen from './src/screens/Register/Register';
import RegisterCommerceScreen from './src/screens/Register Commerce/RegisterCommerce';
import MainScreen from './src/screens/Main/index';

// Import functions and constants from utils
import { getStorage, socketAddress } from './src/utils/constants.util';
import { SETSTORAGE, DELETESTORAGE } from './src/store/actionTypes';
import reduxStore from './src/store/index';
import FlashMessage from 'react-native-flash-message';
import TransactionScreen from './src/screens/Transaction/transaction.screen';

// Import Componets
import Description from './src/components/Description/Description'
import socketIO from 'socket.io-client'
import store from './src/store/index';
import { useCallback } from 'react';

const Stack = createStackNavigator();

const App = () => {
  const { global } = store.getState()
  console.log('Globla', global)
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

  const Connection = useCallback(() => {
      const socket = socketIO(socketAddress, {
        path: '/socket-user',
        query: {
          token: global.token,
        },
        forceNew: true,
        transports: ['websocket']
      })

      console.log('Socket Conet')

      socket.on('connect', () => {
        console.log('Conectado')
      })

      socket.on('BALANCEREFRESH', (data) => {
        console.log('Data', data)
        console.log('Global Info', Object.keys(global))
        const dataaStorage = {
          ...global,
          info: {
            ...global.info,
            amount_wallet: data.balance
          }
        }

        store.dispatch({ type: SETSTORAGE, payload: dataaStorage })
      })

      /* socket.disconnect('disconnect', () => { 
        console.log('Desconectado')
      }) */
    },[],
  )

  useEffect(_ => {
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
