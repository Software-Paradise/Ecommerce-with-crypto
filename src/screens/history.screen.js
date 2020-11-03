import React, {useState, useEffect, useReducer} from 'react';
import {View, Text, FlatList} from 'react-native';
import store from '../store';
import {errorMessage, http, reducer} from '../utils/constants.util';
import StoreElement from './../components/store-element.component';

const initialState = {
  history: [],
};

const HistoryScreen = ({navigation}) => {
  //   const [state, dispatch] = useReducer(reducer, initialState);
  const {global} = store.getState();
  const [transactions, setTransactions] = useState([]);
  console.log(global.wallet_commerce);

  const ConfigureComponent = async () => {
    try {
      const {data} = await http.get(
        `/api/ecommerce/wallet/details/${global.wallet_commerce}`,
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
    <FlatList
      keyExtractor={(_, key) => (key = key.toString())}
      data={transactions}
      renderItem={StoreElement}
    />
  );
};

export default HistoryScreen;
