import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {GlobalStyles} from '../styles/global.style';
import {
  Colors,
} from '../utils/constants.util';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const RetirementsScreen = ({navigation}) => {
  const [walletAddress, setWalletAddress] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const toggleScan = () => setShowScanner(!showScanner);
  const onReadCodeQR = ({data}) => {
    toggleScan();
    setWalletAddress(data);
  };
  return (
    <SafeAreaView style={GlobalStyles.superContainer}>
      <Modal
        backdropOpacity={0.9}
        animationIn="fadeIn"
        onBackButtonPress={toggleScan}
        onBackdropPress={toggleScan}
        animationOut="fadeOut"
        isVisible={showScanner}>
        <View style={styles.containerQR}>
          <QRCodeScanner
            onRead={onReadCodeQR}
            flashMode={RNCamera.Constants.FlashMode.auto}
          />
        </View>
      </Modal>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('./../assets/img/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={{alignItems: 'center', padding: RFValue(30)}}>
        <Text
          style={{
            fontSize: RFValue(18),
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: Colors.$colorYellow,
          }}>
          Retiro de fondos
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: RFValue(20),
        }}>
        <View style={{flex: 0.8}}>
          <Text style={styles.label}>Dirección de billetera externa</Text>
          <TextInput
            style={[
              GlobalStyles.textInput,
              {
                paddingVertical: RFValue(5),
              },
            ]}
          />
        </View>
        <View
          style={{
            flex: 0.2,
            marginBottom: RFValue(4),
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={toggleScan}
            style={{
              backgroundColor: Colors.$colorYellow,
              borderRadius: RFValue(50),
              padding: RFValue(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcon
              name="qrcode-scan"
              size={RFValue(20)}
              color={Colors.$colorBlack}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          padding: RFValue(20),
        }}>
        <Text style={styles.label}>Monto a retirar</Text>
        <TextInput
          style={[
            GlobalStyles.textInput,
            {
              paddingVertical: RFValue(4),
            },
          ]}
        />
      </View>
      <View
        style={{
          padding: RFValue(20),
        }}>
        <TouchableOpacity
          onPress={() => console.log('Retire')}
          style={{
            backgroundColor: Colors.$colorYellow,
            borderRadius: RFValue(50),
            padding: RFValue(15),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: RFValue(16),
              fontWeight: 'bold',
            }}>
            Retirar
          </Text>
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
  containerQR: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(5),
    height: RFValue(320),
    overflow: 'hidden',
  },
});
export default RetirementsScreen;
