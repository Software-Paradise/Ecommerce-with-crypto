import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlobalStyles} from '../styles/global.style';
import {Colors} from '../utils/constants.util';
import FooterComponent from '../components/footer.component';
import {RFValue} from 'react-native-responsive-fontsize';
import ButtonWithIcon from '../components/button-with-icon.component';
import ButtonSupport from '../components/buttonsupport.component';

const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <View style={WelcomeStyles.container}>
        <View style={WelcomeStyles.centered}>
          <Image
            source={require('./../assets/img/aly-coin.png')}
            style={WelcomeStyles.alyCoin}
          />
          <Text style={WelcomeStyles.textTitle}>¡Bienvenido/a a</Text>
          <Text style={WelcomeStyles.textTitle}>AlyPay E-commerce!</Text>
          <Text style={{...WelcomeStyles.textBody, ...WelcomeStyles.spacing, textAlign: 'center'}}>
            ¡Está a un solo paso de completar su registro!
          </Text>
          <View style={WelcomeStyles.spacing}>
            <View>
              <ButtonWithIcon onPress={() => navigation.navigate('RegisterCommerce')} text='REGISTRA TU COMERCIO' type='filled' icon='store'/>
            </View>
          </View>
          <FooterComponent />
        </View>
      </View>
      <ButtonSupport/>
    </SafeAreaView>
  );
};

const WelcomeStyles = StyleSheet.create({
  textBody: {
    color: Colors.$colorYellow,
    fontSize: RFValue(18),
  },
  textTitle: {
    color: Colors.$colorYellow,
    fontSize: RFValue(26),
    fontWeight: 'bold',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  alyCoin: {
    width: RFValue(260),
    height: RFValue(260),
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 0.5,
  },
  spacing: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(25),
  },
  topText: {
    color: Colors.$colorYellow,
    fontSize: 18,
    paddingBottom: RFValue(20),
    paddingHorizontal: 20,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
