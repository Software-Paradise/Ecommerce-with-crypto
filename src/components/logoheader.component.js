import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import {RFValue} from 'react-native-responsive-fontsize';

const LogoHeaderComponent = (props) => {
  return (
    <View style={LogoStyles.container}>
      <Image
        style={LogoStyles.logo}
        source={require('./../assets/img/logo.png')}
      />
      <Text style={GlobalStyles.textTitle}>{props.title}</Text>
    </View>
  );
};

const LogoStyles = StyleSheet.create({
  logo: {
    width: RFValue(300),
    height: RFValue(100),
    marginVertical: RFValue(20),
  },
  container: {
    alignItems: 'center',
    padding: RFValue(20),
  },
});

export default LogoHeaderComponent;
