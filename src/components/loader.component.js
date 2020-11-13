import React from 'react';
import Modal from 'react-native-modal';
import Lottie from 'lottie-react-native';

import loaderAnimation from '../animations/loader.json';
import {RFValue} from 'react-native-responsive-fontsize';
import {Dimensions} from 'react-native';

const Loader = ({isVisible = false, size = 128}) => {
  return (
    <Modal
      style={{
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <Lottie
        style={{
          height: RFValue(size),
          width: RFValue(size),
          alignSelf: 'center',
        }}
        source={loaderAnimation}
        loop
        autoPlay
      />
    </Modal>
  );
};

export default Loader;
