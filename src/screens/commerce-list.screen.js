import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Colors } from '../utils/constants.util';
import { GlobalStyles } from '../styles/global.style';
import { RFValue } from 'react-native-responsive-fontsize';

const CommerceList = ({navigation}) => {
    return (
        <SafeAreaView style={GlobalStyles.superContainer}>
            <ScrollView>
                <View style={CommerceListStyles.commerceRow}>
                    <Text style={CommerceListStyles.commerceRowTitle}>Comercio 1</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const CommerceListStyles = StyleSheet.create({
    commerceRow: {
        backgroundColor: Colors.$colorBlack,
        color: Colors.$colorYellow,
        margin: RFValue(20),
        padding: RFValue(20),
        borderRadius: RFValue(10),
    },
    commerceRowTitle: {
        color: Colors.$colorGray,
        fontSize: RFValue(18),
    },
    commerceRowBody: {
        fontSize: 10,
        color: Colors.$colorYellow,
    }
});

export default CommerceList;