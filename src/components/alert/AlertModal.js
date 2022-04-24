import React from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AlertModal = ({visible, message, onChangeState}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onChangeState();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>{message}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={() => {
              onChangeState();
            }}>
            <Text style={styles.textStyle}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    maxWidth: wp('75%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('6%'),
    alignItems: 'center',
    elevation: 2,
  },
  button: {
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    elevation: 1,
    backgroundColor: '#F6897F',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
  },
  modalTextContainer: {
    marginBottom: hp('2.5%'),
  },
  modalText: {
    textAlign: 'center',
    fontFamily: 'Segoe UI',
    color: 'black',
    fontSize: wp('5%'),
  },
});
