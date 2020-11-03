/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput, Dimensions} from 'react-native';
import {Colors, logOutApp} from '../utils/constants.util';
import {registerStyles} from './register.screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';


const PaymentScreen = () => {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            setAmount('');
        });

        return _unsubscribe;
    }, []);

    return (
           <View style={PaymentStyles.mainContainer}>
                <View style={PaymentStyles.inputContainer}>
                    <Text style={PaymentStyles.titleLabel}>
                        Ingrese el monto (USD)
                    </Text>
                    <View style={registerStyles.textInputWithImage}>
                        <MaterialIcons name='attach-money' size={16} color={Colors.$colorGray}/>
                        <TextInput
                            style={registerStyles.textInputCol}
                            placeholder="0.00"
                            placeholderTextColor={Colors.$colorGray}
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={(value) => setAmount(value)}
                        />
                    </View>

                </View>
               <View style={PaymentStyles.buttonSpacing}>
                   <TouchableOpacity style={PaymentStyles.buttonFill} onPress={() => navigation.navigate('Transaction', {
                       amount,
                   })}>
                       <Text style={PaymentStyles.buttonText}>
                           Procesar transaccion
                       </Text>
                       <MaterialCommunityIcons name='qrcode-scan' size={24} color={Colors.$colorBlack}/>
                   </TouchableOpacity>
                   <TouchableOpacity style={PaymentStyles.buttonFill} onPress={logOutApp}>
                        <Text style={PaymentStyles.buttonText}>
                            Salir
                        </Text>
                        <MaterialCommunityIcons name='logout-variant' size={24} color={Colors.$colorBlack} />
                   </TouchableOpacity>
               </View>
           </View>
        
    )
};

const PaymentStyles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: Colors.$colorBlack,
        padding: 20,
        width: Dimensions.get('window').width - 80,
        borderRadius: 20
    },
    titleLabel: {
        color: Colors.$colorYellow,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
        paddingHorizontal: 10
    },
    buttonSpacing: {
        padding: 10,
        textAlign: 'center'
    },
    buttonFill: {
        backgroundColor: Colors.$colorYellow,
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: Dimensions.get('window').width - 80,
        justifyContent: 'center',
        borderRadius: 50,
        marginVertical: 20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10
    }
})

export default PaymentScreen