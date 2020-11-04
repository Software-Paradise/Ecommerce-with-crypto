/* eslint-disable prettier/prettier */
import React, {useState, useCallback, useEffect} from 'react';

import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import {Colors} from './../utils/constants.util';

/**
 *
 * Componente switch para main view
 */

const Switch = ({onSwitch = () => {}, items = []}) => {
  const [state, setState] = useState(items[0].state);

  const changeState = useCallback(() => onSwitch(state), [state]);

  const itemWidth = 100 / items.length;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      borderColor: Colors.$colorYellow,
      borderWidth: 1,
      borderRadius: RFValue(50),
      padding: RFValue(2),
      margin: RFValue(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttons: {
      alignItems: 'center',
      padding: RFValue(10),
      borderRadius: RFValue(50),
      width: `${itemWidth}%`,
    },
    buttonActive: {
      backgroundColor: Colors.$colorYellow,
    },
    textButton: {
      fontSize: RFValue(itemWidth / 4),
      textTransform: 'uppercase',
    },
    textButtonActive: {
      color: Colors.$colorMain,
    },
    buttonDisactive: {
      backgroundColor: 'transparent',
    },
    textButtonDisactive: {
      color: Colors.$colorYellow,
    },
  });

  useEffect(() => {
    changeState();
  });

  const ItemComponent = (item, key) => {
    return (
      <TouchableOpacity
        onPress={(_) => setState(item.state)}
        key={key}
        style={
          [state === item.state ? styles.buttonActive : styles.buttonDisactive,
          styles.buttons]
        }>
        <Text
          style={[
            state === item.state
              ? styles.textButtonActive
              : styles.textButtonDisactive,
            styles.textButton,
          ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return <View style={styles.container}>{items.map(ItemComponent)}</View>;
};

export default Switch;
