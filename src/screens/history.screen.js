import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import store from '../store';
import { errorMessage, http, reducer } from '../utils/constants.util';
import StoreElement from './../components/store-element.component';
import { RFValue } from 'react-native-responsive-fontsize';
import Lottie from 'lottie-react-native';
import * as EmptyBox from './../animations/empty-state.json';
import { Colors } from './../utils/constants.util';

// Import Component
import Container from '../components/Container/Container'

const HistoryScreen = ({ navigation }) => {
  //   const [state, dispatch] = useReducer(reducer, initialState);
  const { global } = store.getState();
  const [transactions, setTransactions] = useState([]);
  console.log(global.wallet_commerce);

  const ConfigureComponent = async () => {
    try {
      const { data } = await http.get(`/api/ecommerce/wallet/details/${global.wallet_commerce}`,
        {
          headers: {
            'x-auth-token': global.token,
          },
        },
      );

      setTransactions(data.history);
    } catch (error) {
      errorMessage(error.message);
    }
  };

  useEffect(() => {
    ConfigureComponent();
  }, []);

  return (
    <Container>
      <View>
        {
          transactions.length > 0
            ?
            <FlatList
              keyExtractor={(_, key) => (key = key.toString())}
              data={transactions}
              renderItem={StoreElement}
            />
            :
            <View >
              <Lottie source={EmptyBox} autoPlay loop={false} style={styles.empty} />

              <Text style={styles.titleText}>No hay transacciones realizadas</Text>
            </View>
        }
      </View>
    </Container>
  )
};

const styles = StyleSheet.create({
  empty: {
    alignSelf: "center",
    resizeMode: "contain",
    height: RFValue(250),
    width: RFValue(250),
  },
  titleText: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: Colors.$colorGray
  }
})
export default HistoryScreen;
