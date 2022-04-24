import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TitleText = ({titleText}) => {
  return (
    <View>
      <Text style={styles.title}>{titleText}</Text>
    </View>
  );
};

export default TitleText;

const styles = StyleSheet.create({
  title: {
    fontSize: wp('7%'),
    fontFamily: 'AvantGardeDemiBT',
    color: 'black',
  },
});
