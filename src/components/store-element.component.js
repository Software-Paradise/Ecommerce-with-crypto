import React from 'react';
// Import Functions and constanst
import moment from 'moment';

import { Colors, CopyClipboard } from './../utils/constants.util';
import { RFValue } from 'react-native-responsive-fontsize';
// Import components
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StoreElement = (item, index) => (
  <View>
    <TouchableOpacity onPress={(_) => CopyClipboard(item.item.hash)} style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.name}>{item.item.description || 'Transacción'}</Text>
        <Text style={styles.hash}>
          {item.item.hash?.substr(0, 10)}...
        {item.item.hash?.substr(
            item.item.hash.length - 10,
            item.item.hash.length - 1,
          )}
        </Text>

        <View style={styles.detailsContain}>
          <Text style={styles.id}># {item.item.id}</Text>
          <Text style={styles.date}>{moment(item.item.date_create).format('DD/MM/YY | HH:mm a')}</Text>
        </View>
      </View>

      <Icon name={item.item.debit ? 'arrow-expand-up' : 'arrow-collapse-down'} color={item.item.debit ? Colors.$colorRed : Colors.$colorGreen} size={RFValue(12)} />
      <Text style={[styles.amount, item.item.debit ? styles.debitAmount : styles.creditAmount,]}>
        {item.item.amount} {item.item.symbol}
      </Text>
    </TouchableOpacity>
  </View >
);
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.$colorBlack,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRadius: RFValue(10),
    flexDirection: 'row',
    elevation: 25,
    padding: RFValue(10),
    marginVertical: RFValue(10),
    marginHorizontal: RFValue(15),
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    color: Colors.$colorYellow,
    textTransform: 'uppercase',
    fontSize: RFValue(14),
  },
  hash: {
    color: '#FFF',
    // fontFamily: "whitrabt",
    fontSize: RFValue(10),
    marginVertical: 10,
  },
  detailsContain: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  id: {
    color: Colors.$colorYellow,
    fontSize: RFValue(12),
    marginRight: RFValue(10),
  },
  date: {
    color: '#CCC',
    fontSize: RFValue(12),
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
});
export default StoreElement;
