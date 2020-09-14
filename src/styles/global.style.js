import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';

const buttonStyle = {
  alignItems: 'center',
  borderRadius: 50,
  justifyContent: 'center',
  padding: 8,
};

export const GlobalStyles = StyleSheet.create({
  button: buttonStyle,
  containerPicker: {
    backgroundColor: Colors.$colorMain,
    borderRadius: 5,
    borderWidth: 2,
    elevation: 5,
  },
  picker: {
    paddingHorizontal: 0,
    color: '#FFF',
  },
  textInput: {
    backgroundColor: Colors.$colorBlack,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.$colorYellow + '55',
    color: '#FFF',
    elevation: 5,
    padding: RFValue(10),
    zIndex: 50,
  },
  textButton: {
    color: Colors.$colorMain,
    // fontWeight: 'bold',
    fontSize: RFValue(18),
    textTransform: 'uppercase',
  },
  buttonNoBorder: {
    ...buttonStyle,
    borderWidth: 0,
  },
  buttonPrimaryLine: {
    ...buttonStyle,
    borderWidth: 1,
    borderColor: Colors.$colorYellow,
  },
  textButtonPrimaryLine: {
    color: Colors.$colorYellow,
    fontSize: RFValue(18),
    textTransform: 'uppercase',
  },
  buttonPrimary: {
    ...buttonStyle,
    backgroundColor: Colors.$colorYellow,
  },
  buttonSecondary: {
    ...buttonStyle,
    backgroundColor: Colors.$colorSecondary,
  },
  superContainer: {
    flex: 1,
    backgroundColor: Colors.$colorMain,
    position: 'relative',
  },
  textBody: {
    color: Colors.$colorYellow,
    fontSize: 18,
  },
  textTitle: {
    color: Colors.$colorYellow,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dotSevenColumn: {
    flex: 0.7,
  },
  dotThreeColumn: {
    flex: 0.3,
  },
  textInputWithImage: {
    ...this.textInput,
    flexDirection: 'row',
  },
  textInputCol: {
    flex: 0.9,
    color: 'white',
  },
  touchableCol: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
});
