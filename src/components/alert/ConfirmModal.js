import React from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ConfirmModal = ({
  visible,
  yesText,
  noText,
  message,
  onConfirmNo,
  onConfirmYes,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onConfirmNo();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>{message}</Text>
          </View>
          <View style={styles.confirmButton}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              activeOpacity={0.9}
              onPress={() => {
                onConfirmNo();
              }}>
              <Text style={styles.textStyle}>{noText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={() => {
                onConfirmYes();
              }}>
              <Text style={styles.textStyle}>{yesText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: wp('75%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('6%'),
    alignItems: 'center',

    elevation: 2,
  },
  button: {
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    width: wp('20%'),
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
  confirmButton: {
    width: wp('75%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: wp('6%'),
  },
});
