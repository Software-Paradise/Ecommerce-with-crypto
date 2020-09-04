import React from 'react';
import {Text, SafeAreaView, StyleSheet} from 'react-native';
import {Colors} from '../utils/constants.util';

const LoginScreen = ({navigation}) => {
  return (
    <SafeAreaView style={loginStyles.container}>
      <Text style={loginStyles.text}>Login Screen</Text>
    </SafeAreaView>
  );
};

const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.$colorBlack,
    flex: 1,
  },
  text: {
    color: Colors.$colorYellow,
  },
});

export default LoginScreen;
