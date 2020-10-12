/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
