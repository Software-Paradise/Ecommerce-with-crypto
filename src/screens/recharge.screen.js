import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import {GlobalStyles} from '../styles/global.style';
import {useRoute} from '@react-navigation/core';
import {Colors, CopyClipboard} from '../utils/constants.util';

const RechargeScreen = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const route = useRoute();
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('./../assets/img/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.label}>Toca para copiar</Text>
        <TouchableOpacity
          onPress={() => CopyClipboard(route.params.wallet)}
          style={styles.hashContainer}>
          <Text style={styles.hashText}>
            {route.params.wallet.substring(0, 40)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{
        borderWidth: 0.5,
        margin: RFValue(20),
        borderColor: Colors.$colorGray,
      }}/>
      <View style={{flexDirection: 'row', paddingHorizontal: RFValue(20)}}>
        <View style={{flex: 0.3}}>
          <Text style={styles.label}>Cantidad USD</Text>
          <TextInput style={[GlobalStyles.textInput, {
            paddingVertical: RFValue(3),
            paddingStart: RFValue(15),
          }]} />
        </View>
        <View style={{flex: 0.7, paddingLeft: RFValue(10)}}>
          <Text style={styles.label}>Hash de transacción</Text>
          <TextInput style={[GlobalStyles.textInput, {
            paddingVertical: RFValue(3),
            paddingStart: RFValue(15),
          }]}/>
        </View>
      </View>
      <View style={{
        padding: RFValue(20),
      }}>
        <TouchableOpacity
        style={{
          backgroundColor: Colors.$colorYellow,
          borderRadius: RFValue(50),
          padding: RFValue(12),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={{
            fontSize: RFValue(15),
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignContent: 'center',
    resizeMode: 'contain',
    height: RFValue(128),
    width: RFValue(256),
  },
  label: {
    color: Colors.$colorYellow,
    fontSize: RFValue(12),
  },
  hashContainer: {
    borderWidth: 1,
    borderColor: Colors.$colorYellow,
    borderRadius: RFValue(50),
    padding: RFValue(10),
    marginVertical: RFValue(5)
  },
  hashText: {
    color: Colors.$colorYellow,
    fontSize: RFValue(15),
    textTransform: 'uppercase',
  },
});

export default RechargeScreen;
