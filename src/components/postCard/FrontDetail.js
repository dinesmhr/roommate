import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

const FrontDetail = ({
  onPostDetailPress,
  title,
  price,
  location,
  imageSource,
}) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.9} onPress={onPostDetailPress}>
        <View>
          <View style={styles.cardImgWrapper}>
            <Image
              source={{uri: imageSource}}
              resizeMode="contain"
              style={styles.cardImg}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, {fontFamily: 'Segoe UI Bold'}]}>
              {title}
            </Text>
            <Text>
              <Feather name="map-pin" size={wp('4%')} color="#F6897F" />
              <Text> </Text>
              <Text style={styles.cardTitle}>{location}</Text>
            </Text>

            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={[
                  styles.cardTitle,
                  {textTransform: 'none', color: '#F6897F'},
                ]}>
                NPR. {price}/month
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FrontDetail;

const styles = StyleSheet.create({
  cardImgWrapper: {
    height: hp('29%'),
    width: wp('83.6%'),
  },
  cardImg: {
    height: '100%',
    width: '100%',
    borderRadius: wp('7%'),
    resizeMode: 'cover',
  },
  cardInfo: {
    marginHorizontal: wp('2%'),
    marginTop: wp('2%'),
  },
  cardTitle: {
    fontSize: wp('5%'),
    textTransform: 'capitalize',
    fontFamily: 'Segoe UI',
    color: 'black',
  },
});
