import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FloatingButton = ({onPress}) => {
  return (
    <View style={styles.touchableOpacity}>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <Feather name="plus" color="white" size={wp('9%')} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  touchableOpacity: {
    position: 'absolute',
    height: wp('13%'),
    width: wp('13%'),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('4.8%'),
    bottom: hp('3%'),
    backgroundColor: '#F6897F',
    elevation: 1.5,
  },
});
