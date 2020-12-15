import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Import Componets
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import constants and functions
import { Colors, RFValue, CopyClipboard } from '../../utils/constants.util'
// import {useNavigation} from '@react-navigation/native'


const HistoryElement = ({ item, index }) => {

    // const navigation = useNavigation()

    // Funcion que permite visualizar el detalle de la transaccion
    async function proccessData(value) {
        CopyClipboard(value);
        // navigation.navigate("Transacciones", { hash: value })
    }

    return (
        <View key={index}>
            <TouchableOpacity onPress={_ => proccessData(item.hash)} style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.textTitle}>{item.description || 'Transacción'}</Text>
                    <Text style={styles.textHash}> {item.hash.substr(0, 15) || ''}</Text>

                    <View style={styles.detailsContain}>
                        <Text style={styles.textId}># {item.id}</Text>
                        <Text style={styles.textDate}>{moment(item.date_create).format('DD/MM/YY | HH:mm a')}</Text>
                    </View>
                </View>

                <Icon name={item.debit ? 'arrow-expand-up' : 'arrow-collapse-down'} color={item.debit ? Colors.$colorRed : Colors.$colorGreen} size={RFValue(12)} />
                <Text style={[styles.amount, item.debit ? styles.debitAmount : styles.creditAmount]}>{item.amount} {item.symbol}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderRadius: RFValue(10),
        flexDirection: 'row',
        elevation: 25,
        padding: RFValue(10),
        marginVertical: RFValue(10)
    },
    subContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    textTitle: {
        color: Colors.$colorYellow,
        textTransform: 'uppercase',
        fontSize: RFValue(14),
    },
    textHash: {
        color: '#FFF',
        fontSize: RFValue(12),
        marginVertical: 10,
    },
    textId: {
        color: Colors.$colorYellow,
        fontSize: RFValue(12),
        marginRight: RFValue(10),
    },
    textDate: {
        color: '#CCC',
        fontSize: RFValue(12),
    },
    detailsContain: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    },
    amount: {
        fontSize: RFValue(16),
        color: '#FFF',
        marginLeft: 5,
    },
    debitAmount: {
        color: Colors.$colorRed,
    },
    creditAmount: {
        color: Colors.$colorGreen,
    },
})

export default HistoryElement
