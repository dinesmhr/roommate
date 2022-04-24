import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HeaderText = ({headerText}) => {
  return <Text style={styles.header}>{headerText}</Text>;
};

export default HeaderText;

const styles = StyleSheet.create({
  header: {
    fontFamily: 'AvantGardeDemiBT',
    fontSize: wp('10%'),
    color: 'black',
    paddingBottom: hp('0.5%'),
  },
});
