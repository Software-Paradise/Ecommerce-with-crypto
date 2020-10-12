import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import React from 'react';
import {Colors} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';

const FooterComponent = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={FooterStyles.container}>
      <Image
        source={require('../assets/img/aly-system-by.png')}
        style={FooterStyles.logoAly}
      />
      <TouchableOpacity style={FooterStyles.termsAndConditions}>
        <Text style={FooterStyles.termsAndConditionsText} >
          Términos y condiciones
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const FooterStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: RFValue(52),
    paddingBottom: RFValue(15),
  },
  logoAly: {
    width: RFValue(150),
    height: RFValue(80),
    resizeMode: 'contain',
  },
  termsAndConditions: {
    fontSize: RFValue(10),
  },
  termsAndConditionsText: {
    color: Colors.$colorYellow,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
  },
});

export default FooterComponent;
