import React, {useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FormPicker = ({
  title,
  iconSource,
  placeholder,
  label1,
  value1,
  label2,
  value2,
  label3,
  value3,
  label4,
  value4,
  setValue,
  selectedOption,
}) => {
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  return (
    <View style={styles.formPicker}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputPicker}>
        <View style={{justifyContent: 'center'}}>
          <Image source={iconSource} style={styles.icon} />
          <TouchableOpacity onPress={() => open()}>
            <Picker
              style={styles.pickerStyle}
              ref={pickerRef}
              dropdownIconColor="#F6897F"
              itemStyle={{
                fontFamily: 'Segoe UI',
                fontSize: wp('5%'),
              }}
              itemTextStyle={{
                color: 'blue',
                fontFamily: 'Segoe UI',
                fontSize: wp('5%'),
              }}
              selectedValue={selectedOption}
              onValueChange={(itemValue, itemIndex) => {
                setValue(itemValue);
              }}>
              <Picker.Item
                label={placeholder}
                fontFamily="Segoe UI"
                enabled={false}
                style={styles.pickerItem}
              />
              <Picker.Item
                label={label1}
                fontFamily="Segoe UI"
                style={styles.pickerItem}
                value={value1}
              />
              <Picker.Item
                label={label2}
                style={styles.pickerItem}
                fontFamily="Segoe UI"
                value={value2}
              />
              <Picker.Item
                label={label3}
                value={value3}
                fontFamily="Segoe UI"
                style={styles.pickerItem}
              />
              <Picker.Item
                label={label4}
                fontFamily="Segoe UI"
                value={value4}
                fontFamily="Segoe UI"
                style={styles.pickerItem}
              />
            </Picker>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FormPicker;

const styles = StyleSheet.create({
  formPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  inputPicker: {
    position: 'relative',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F6897F',
    paddingLeft: wp('3%'),
    height: hp('5%'),
    width: wp('50%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
  },
  pickerStyle: {
    marginLeft: wp('5%'),
    color: 'black',
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
  },
  title: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
  icon: {
    height: hp('3.5%'),
    width: wp('6.5%'),
    resizeMode: 'cover',
    position: 'absolute',
  },
  pickerItem: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
  },
});
