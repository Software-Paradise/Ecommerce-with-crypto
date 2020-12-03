import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../utils/constants.util';
import { GlobalStyles } from '../styles/global.style';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommerceItem from './../components/commerce-item.component';

const CommerceList = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false)

    const data = [
        {
            id: '1',
            name: 'Comercio 1',
        },
        {
            id: '2',
            name: 'Comercio 2',
        },
        {
            id: '3',
            name: 'Comercio 3',
        },
    ];

    return (
        <SafeAreaView style={GlobalStyles.superContainer}>
            <Text style={CommerceListStyles.viewTitle}>Listado de comercios</Text>

            <FlatList
                data={data}
                renderItem={({ item }) => <CommerceItem id={item.id} name={item.name} />}
            />

            <View style={CommerceListStyles.buttonFixed}>
                <TouchableOpacity style={CommerceListStyles.addButtonStyle}>
                    <Icon name="add" size={RFValue(50)} color={Colors.$colorBlack} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const CommerceListStyles = StyleSheet.create({
    viewTitle: {
        color: Colors.$colorYellow,
        fontSize: RFValue(30),
        marginHorizontal: RFValue(20),
        marginVertical: RFValue(10)
    },
    buttonFixed: {
        position: 'absolute',
        bottom: '5%',
        right: '5%',
    },
    addButtonStyle: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: 50,
        height: RFValue(60),
        width: RFValue(60),
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CommerceList;
