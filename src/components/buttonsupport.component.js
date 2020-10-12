import React from 'react';
import {TouchableOpacity, StyleSheet, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';

const ButtonSupport = () => {
  return (
    <TouchableOpacity
      onPress={OpenSupport}
      style={ButtonSupportStyles.buttonSupport}>
      <Icon name="whatsapp" size={30} color={Colors.$colorBlack} />
    </TouchableOpacity>
  );
};

const ButtonSupportStyles = StyleSheet.create({
  buttonSupport: {
    position: 'absolute',
    left: '10%',
    bottom: '5%',
    padding: 10,
    borderRadius: RFValue(50),
    backgroundColor: Colors.$colorYellow,
  },
});

export const OpenSupport = () =>
  Linking.openURL('whatsapp://send?phone=+50660727720');

export default ButtonSupport;
