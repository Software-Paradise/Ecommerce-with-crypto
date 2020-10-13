import React, {useState} from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlobalStyles} from '../styles/global.style';
import {Colors} from '../utils/constants.util';
import {RFValue} from 'react-native-responsive-fontsize';

const TransactionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <SafeAreaView style={[GlobalStyles.superContainer, {justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={TransactionStyles.mainTitle}>
                Procesar transaccion
            </Text>
            <View style={TransactionStyles.mainContainer}>

            </View>
        </SafeAreaView>
    )
};

const TransactionStyles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.$colorBlack,
        borderRadius: RFValue(20),
        height: Dimensions.get('window').height - 120,
        width: Dimensions.get('window').width - 80
    },
    mainTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(18),
        fontWeight: 'bold'
    }
})

export default TransactionScreen;
