import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

const CustomTextInput = props => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...props}
        style={styles.textInput}
        placeholderTextColor="#F6897F"
      />
      {props.type == 'password' && (
        <TouchableOpacity onPress={props.onPress}>
          {props.status ? (
            <Feather name="eye-off" color="#F6897F" size={wp('5%')} />
          ) : (
            <Feather name="eye" color="#F6897F" size={wp('5%')} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    width: wp('85%'),
  },
  textInput: {
    height: hp('7%'),
    width: wp('79%'),
    color: '#F6897F',
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
  },
});
