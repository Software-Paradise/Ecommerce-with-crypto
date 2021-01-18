import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Linking, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../utils/constants.util';
import { RFValue } from 'react-native-responsive-fontsize';

const ButtonSupport = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const eventShowKeyboard = Keyboard.addListener('keyboardDidShow', () =>
      setHidden(true),
    );

    const eventHideKeyboard = Keyboard.addListener('keyboardDidHide', () =>
      setHidden(false),
    );

    return () => {
      eventShowKeyboard.remove();
      eventHideKeyboard.remove();
    };
  }, []);
  return (
    <>
      {!hidden && (
        <TouchableOpacity
          onPress={OpenSupport}
          style={ButtonSupportStyles.buttonSupport}>
          <Icon name="whatsapp" size={30} color={Colors.$colorBlack} />
        </TouchableOpacity>
      )}
    </>
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
  Linking.openURL('https://wa.me/+50585570529');

export default ButtonSupport;
