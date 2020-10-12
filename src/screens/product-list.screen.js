import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GlobalStyles} from '../styles/global.style';
import {Colors} from '../utils/constants.util';
import ProductItem from './../components/product-item.component';

const ProductList = ({navigation}) => {
  const products = [
      {
          id: '1',
          name: 'Producto 1',
          price: 'NIO 100.0',
          stock: '500'
      },
      {
          id: '2',
          name: 'Producto 2',
          price: 'NIO 82.0',
          stock: '0'
      }
  ];

  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <View style={ProductListStyles.header}>
        <View style={ProductListStyles.rounded}>
          <Icon name="store" color={Colors.$colorBlack} size={50} />
        </View>
        <View style={ProductListStyles.titleRow}>
          <Text style={ProductListStyles.title}>Comercio 1</Text>
          <Text style={ProductListStyles.subtitle}>(USD)</Text>
        </View>
      </View>
      <Text style={ProductListStyles.listHeader}>Productos</Text>
      <FlatList data={products} renderItem={({item}) => <ProductItem name={item.name} price={item.price} stock={item.stock} />}/>
    </SafeAreaView>
  );
};

const ProductListStyles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(20),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rounded: {
    backgroundColor: Colors.$colorYellow,
    borderRadius: 50,
    padding: 5,
  },
  title: {
    color: Colors.$colorGray,
    fontSize: RFValue(30),
  },
  subtitle: {
    color: Colors.$colorGray,
    fontSize: RFValue(15),
  },
  listHeader: {
    fontSize: RFValue(35),
    color: Colors.$colorYellow,
    paddingHorizontal: RFValue(20),
    paddingHorizontal: RFValue(15),
  },
});

export default ProductList;
