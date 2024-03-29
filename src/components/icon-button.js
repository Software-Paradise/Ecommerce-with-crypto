import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../utils/constants.util';
import { RFValue } from 'react-native-responsive-fontsize';

const IconButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={IconButtonStyle.container}>
      <Icon
        name={props.icon}
        size={RFValue(22)}
        color={props.type === 'filled' ? Colors.$colorBlack : Colors.$colorYellow
        }
      />
    </TouchableOpacity>
  );
};

const IconButtonStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: RFValue(50),
    padding: RFValue(10),
    backgroundColor: Colors.$colorYellow,
    borderRadius: RFValue(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
