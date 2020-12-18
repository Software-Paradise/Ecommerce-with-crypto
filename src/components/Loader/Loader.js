import React from 'react';
import { StyleSheet } from 'react-native'
import Modal from 'react-native-modal';
import Lottie from 'lottie-react-native';

import loaderAnimation from '../../animations/loader.json';
import { RFValue } from 'react-native-responsive-fontsize';


const Loader = ({ isVisible }) => {
  return (
    <Modal backdropOpacity={0.8} isVisible={isVisible} animationIn='fadeIn' animationOut='fadeOut'>
      <Lottie
        style={styles.container}
        autoPlay
        loop
        source={loaderAnimation}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: RFValue(526),
    height: RFValue(256),
    alignSelf: "center"
  }
})

export default Loader;
