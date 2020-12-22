import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

// Import Constants
import { Colors, RFValue } from '../../utils/constants.util'


const Switch = ({ onSwitch = () => { }, items = [] }) => {
    const [state, setState] = useState(items[0].state)

    // Esperamos que el estado cambie para saber cuando el usuario cambia de estado
    const changeState = useCallback(() => onSwitch(state), [state])

    /**Constante que define el ancho de cada item */
    const itemWidth = 100 / items.length;

    useEffect(() => {
        changeState()
    }, [state])

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            borderColor: Colors.$colorYellow,
            borderWidth: 1.5,
            borderRadius: RFValue(50),
            padding: RFValue(0),
            margin: RFValue(15),
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
            fontSize: RFValue(itemWidth / 2 * .8),
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

    const ItemComponent = (item, key) => {
        return (
            <TouchableOpacity onPress={_ => setState(item.state)} key={key} style={[state === item.state ? styles.buttonActive : styles.buttonDisactive, styles.buttons]}>
                <Text style={[state === item.state ? styles.textButtonActive : styles.textButtonDisactive, styles.textButton]}>
                    {item.text}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            {
                items.map(ItemComponent)
            }
        </View>
    )
}


export default Switch