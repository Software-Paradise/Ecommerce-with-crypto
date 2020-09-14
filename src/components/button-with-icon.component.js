import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../utils/constants.util';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';

const ButtonWithIcon = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={
        props.type === 'filled'
          ? buttonStyle.containerFilled
          : buttonStyle.containerOutline
      }>
      <Text
        style={
          props.type === 'filled'
            ? buttonStyle.textButtonFilled
            : buttonStyle.textButtonOutlined
        }>
        {props.text}
      </Text>
      <Icon
        color={
          props.type === 'filled' ? Colors.$colorBlack : Colors.$colorYellow
        }
        name={props.icon}
        size={24}
      />
    </TouchableOpacity>
  );
};

const buttonStyle = StyleSheet.create({
  containerFilled: {
    flexDirection: 'row',
    backgroundColor: Colors.$colorYellow,
    borderRadius: 50,
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerOutline: {
    flexDirection: 'row',
    borderColor: Colors.$colorYellow,
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
  },
  textButtonFilled: {
    fontSize: RFValue(20),
    color: Colors.$colorBlack,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  textButtonOutlined: {
    fontSize: RFValue(20),
    color: Colors.$colorYellow,
    fontWeight: 'bold',
    paddingRight: 5,
  },
});

export default ButtonWithIcon;
