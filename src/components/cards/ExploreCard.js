import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ExploreCard = ({onPress, category, source}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View>
        <View style={styles.cardImgWrapper}>
          <Image source={source} resizeMode="cover" style={styles.img} />
        </View>
        <View style={styles.category}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  img: {
    width: wp('38%'),
    height: wp('34.5%'),
    borderRadius: wp('5%'),
  },
  category: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp('1%'),
  },
  categoryText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Segoe UI',
    color: 'black',
  },
});
