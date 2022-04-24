import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FormInput = props => {
  return (
    <View style={styles.formInput}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput style={styles.inputText} {...props} />
    </View>
  );
};

export default FormInput;

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
    borderWidth: 1,
    borderColor: '#F6897F',
    paddingHorizontal: wp('3%'),
    paddingVertical: 0,
    height: hp('5.5%'),
    width: wp('50%'),
    borderRadius: wp('5%'),
    color: 'black',
    fontFamily: 'Segoe UI',
    backgroundColor: '#fff',
    fontSize: wp('5%'),
  },
});
