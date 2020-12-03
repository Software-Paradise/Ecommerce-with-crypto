import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from './../utils/constants.util';
import { RFValue } from 'react-native-responsive-fontsize';


const CommerceItem = (props) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <View style={ItemStyles.commerceRow}>
            <View style={ItemStyles.commerceRowHeader}>
                <View style={ItemStyles.commerceRowHeaderImage}>
                    <View style={{ backgroundColor: Colors.$colorYellow, borderRadius: 50, alignItems: 'center', padding: 2 }}>
                        <Icon name="store" size={RFValue(50)} color={Colors.$colorBlack} />
                    </View>
                </View>

                <View style={ItemStyles.commerceRowHeaderTitle}>
                    <Text style={ItemStyles.commerceRowTitle}>
                        {props.name}
                    </Text>
                </View>

                <View style={ItemStyles.commerceRowHeaderMenu}>
                    <TouchableOpacity onPress={() => setShowMenu(!showMenu)} >
                        <Icon name="more-vert" size={RFValue(30)} color="white" />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={ItemStyles.commerceRowBody}>
                <View style={ItemStyles.commercerRowBodyItem}>
                    <Text style={ItemStyles.commerceRowBodyTitle}>Ubicacion</Text>

                    <TouchableOpacity onPress={() => console.log(props.id)}>
                        <Text style={ItemStyles.linkStyle}>Ver ubicacion</Text>
                    </TouchableOpacity>

                </View>

                <View style={ItemStyles.commercerRowBodyItem}>
                    <Text style={ItemStyles.commerceRowBodyTitle}>Moneda</Text>

                    <Text style={ItemStyles.currencyTextStyle}>DOLARES (USD)</Text>
                </View>
            </View>
        </View>

    )
}

const ItemStyles = StyleSheet.create({
    commerceRow: {
        backgroundColor: Colors.$colorBlack,
        color: Colors.$colorYellow,
        margin: RFValue(15),
        padding: RFValue(15),
        borderRadius: RFValue(10),
    },
    commerceRowTitle: {
        color: Colors.$colorGray,
        fontSize: RFValue(26),

    },
    commerceRowHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commerceRowHeaderImage: {
        flex: 0.15,
        marginRight: RFValue(10),
    },
    commerceRowHeaderTitle: {
        flex: 0.6,
    },
    commerceRowHeaderMenu: {
        flex: 0.2,
        alignItems: 'flex-end'
    },
    commerceRowBody: {
        flexDirection: 'row',
        margin: RFValue(10),
    },
    commercerRowBodyItem: {
        flex: 0.5,
        alignItems: 'center',
    },
    commerceRowBodyTitle: {
        fontSize: RFValue(18),
        color: Colors.$colorYellow,
        marginBottom: RFValue(15)
    },
    linkStyle: {
        fontSize: RFValue(15),
        color: Colors.$colorBlue,
    },
    currencyTextStyle: {
        fontSize: RFValue(15),
        textTransform: 'uppercase',
        color: Colors.$colorGray
    },

});

export default CommerceItem;