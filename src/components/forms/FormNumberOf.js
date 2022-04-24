import React from 'react';
import {StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FormNumberOf = ({title, iconSource, value, onChangeText}) => {
  return (
    <View style={styles.formInput}>
      <View style={{width: wp('40%')}}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Image source={iconSource} style={styles.icon} />
        <TextInput
          style={styles.inputText}
          value={value}
          keyboardType="numeric"
          autoCompleteType="off"
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default FormNumberOf;

const styles = StyleSheet.create({
  formInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
  inputText: {
    color: 'black',
    paddingVertical: 0,
    fontFamily: 'Segoe UI',
    backgroundColor: 'white',
    fontSize: wp('5%'),
    width: wp('39%'),
    height: hp('5%'),
    borderRadius: wp('5%'),
    paddingHorizontal: wp('3%'),
  },
  inputContainer: {
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
  icon: {
    height: hp('3.5%'),
    width: wp('6.5%'),
    resizeMode: 'cover',
    // position: 'absolute',
  },
});
