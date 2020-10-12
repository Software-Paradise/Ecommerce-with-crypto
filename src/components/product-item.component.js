import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { Colors } from '../utils/constants.util';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductItem = (props) => {
    return (
        <View style={ProductItemStyles.cardContainer}>
            <View style={ProductItemStyles.row}>
            <View style={ProductItemStyles.pictureColumn}>
                <Text style={ProductItemStyles.roundedBg}>P</Text>
            </View>
            <View style={ProductItemStyles.textColumn}>
                <Text style={ProductItemStyles.grayTitle}>{props.name}</Text>
            </View>
            <View style={ProductItemStyles.textColumn}>
                <Text style={ProductItemStyles.grayTitle}>{props.price}</Text>
            </View>
            <View style={ProductItemStyles.menuColumn}>
                <Icon name='more-vert' color={Colors.$colorGray} size={24} />
            </View>
            </View>
            <View style={ProductItemStyles.row}>
                <View style={ProductItemStyles.stockContainer}>
                    <Text style={ProductItemStyles.yellowSmallText}>Existencias:  </Text>
                    <Text style={props.stock === '0' ? ProductItemStyles.redSmallText : ProductItemStyles.yellowSmallText}>{props.stock}</Text>
                </View>
                
            </View>
        </View>
    )
};

const ProductItemStyles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.$colorBlack,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
    },
    row: {
        flexDirection: 'row'
    },
    pictureColumn: {
        flex: .2,
    },
    textColumn: {
        flex: .35,
        justifyContent: 'center'
    },
    menuColumn: {
        flex: .1,
        alignItems: 'flex-end'
    },
    roundedBg: {
        backgroundColor: Colors.$colorYellow,
        borderRadius: 50,
        textAlign: 'center',
        width: 50,
        height: 50,
        textAlignVertical: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    grayTitle: {
        color: Colors.$colorGray,
        fontSize: 24,
    },
    yellowSmallText: {
        fontSize: 15,
        color: Colors.$colorYellow,
    },
    redSmallText: {
        fontSize: 15,
        color: Colors.$colorRed
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 10,
    }
});

export default ProductItem;