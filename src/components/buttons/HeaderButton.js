import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HeaderButton = ({onPress, titleText}) => {
  return (
    <View style={styles.touchableButton}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Feather name="arrow-left" size={wp('8%')} color="black" />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{titleText}</Text>
      </View>
      <Feather name="arrow-left" size={wp('8%')} color="white" />
    </View>
  );
};

export default HeaderButton;

const styles = StyleSheet.create({
  touchableButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: hp('7%'),
    paddingHorizontal: wp('3%'),
    elevation: 1.5,
  },
  title: {
    fontSize: wp('7%'),
    fontFamily: 'AvantGardeDemiBT',
    color: 'black',
  },
});
