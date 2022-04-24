import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RoomDescription = ({src, description, info}) => {
  return (
    <View style={styles.descriptionContainer}>
      <Image source={src} style={styles.icon} />
      <View style={styles.numberOf}>
        {description && <Text style={styles.text}>{description} </Text>}
        <Text style={styles.text}>{info}</Text>
      </View>
    </View>
  );
};

export default RoomDescription;

const styles = StyleSheet.create({
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('5%'),
    paddingVertical: wp('0.5%'),
  },
  icon: {
    height: hp('3.5%'),
    width: wp('6.5%'),
    resizeMode: 'cover',
  },
  numberOf: {
    flexDirection: 'row',
    paddingLeft: wp('3%'),
  },

  text: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
