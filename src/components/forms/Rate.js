import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Rate = ({value, onChangeText}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>Rate</Text>
      <View style={styles.rateContainer}>
        <Text style={[styles.title, {fontSize: wp('4%')}]}>NPR.</Text>
        <TextInput
          style={[
            styles.title,
            {width: wp('20%'), height: hp('5%'), paddingVertical: 0},
          ]}
          value={value}
          keyboardType="numeric"
          autoCompleteType="off"
          onChangeText={onChangeText}
        />
        <Text style={[styles.title, {fontSize: wp('3.5%')}]}>/month</Text>
      </View>
    </View>
  );
};

export default Rate;

const styles = StyleSheet.create({
  rateContainer: {
    borderWidth: 1,
    borderColor: '#F6897F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    height: hp('5.5%'),
    width: wp('50%'),
    borderRadius: wp('5%'),
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
