import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomButton = ({buttonName, onpress}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={onpress}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{buttonName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    elevation: 0.5,
  },
  buttonContainer: {
    height: hp('6.5%'),
    width: wp('62%'),
    backgroundColor: '#F6897F',
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
    color: '#fff',
  },
});
