/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useReducer, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/login.screen';
import RegisterScreen from './src/screens/register.screen';
import LegalDataScreen from './src/screens/legaldata.screen';
import LegalImagesScreen from './src/screens/legalimages.screen';
import WelcomeScreen from './src/screens/welcome.screen';
import RegisterCommerceScreen from './src/screens/registercommerce.screen';
import CommerceList from './src/screens/commerce-list.screen';
import ProductList from './src/screens/product-list.screen';
import MainScreen from './src/screens/main.screen';

// Import functions and constants from utils
import {getStorage, reducer} from './src/utils/constants.util';
import store from './src/store/index';
import {SETSTORAGE, DELETESTORAGE} from './src/store/actionTypes';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import TransactionScreen from './src/screens/transaction.screen';

const Stack = createStackNavigator();

const initialState = {
  loged: false,
  splash: true,
  loader: false,

  internet: true,
};

const App: () => React$Node = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ConfigurateComponent = async () => {
    const payload = await getStorage();

    // disabled all yellow message
    console.disableYellowBox = true;

    if (Object.keys(payload).length > 0) {
      // Creamos el dispatch para el redux
      await store.dispatch({
        type: SETSTORAGE,
        payload,
      });
      // Le decimos que el user esta logeado
      dispatch({type: 'loged', payload: true});
    } else {
      dispatch({type: 'loged', payload: false});

      // Destruimos storage
      await store.dispatch({type: DELETESTORAGE});
    }

    setTimeout(() => dispatch({type: 'splash', payload: false}), 1000);
  };

  useEffect(() => {
    ConfigurateComponent();

    store.subscribe(async (_) => {
      const {global} = store.getState();

      if (Object.keys(global).length > 0) {
        dispatch({type: 'loged', payload: true});
      } else {
        dispatch({type: 'loged', payload: false});
      }
    });

    NetInfo.addEventListener(({isConnected: payload}) =>
      dispatch({type: 'internet', payload}),
    );
  }, []);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {state.loged && (
            <>
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CommerceList"
                component={CommerceList}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ProductList"
                component={ProductList}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Transaction"
                component={TransactionScreen}
                options={{headerShown: false}}
              />
            </>
          )}

          {!state.loged && (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LegalData"
                component={LegalDataScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LegalImages"
                component={LegalImagesScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="RegisterCommerce"
                component={RegisterCommerceScreen}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage floating={true} position='top' />
    </>
  );
};

export default App;
