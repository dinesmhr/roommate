import React, {useState, useContext} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ConfirmModal from './alert/ConfirmModal';
import AlertModal from './alert/AlertModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActionContext} from './UserContext';

const PostTrigger = ({postDetails, postId, navigation, onDropdownClose}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {handleAction} = useContext(ActionContext);

  function onConfirmNo() {
    setConfirmVisible(false);
    onDropdownClose();
  }

  function onConfirmYes() {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        firestore()
          .collection('users')
          .doc(postDetails.postOwnerDocId)
          .update({
            numberOfPosts: firestore.FieldValue.increment(-1),
          })
          .then(() => {
            firestore()
              .collection('notifications')
              .where('postId', '==', postId)
              .get()
              .then(snapshot => {
                snapshot.docs.forEach(doc => {
                  doc.ref.delete().then(() => {
                    firestore()
                      .collection('saved')
                      .where('postId', '==', postId)
                      .get()
                      .then(snapshot => {
                        snapshot.docs.forEach(doc => {
                          doc.ref.delete().then(() => {
                            firestore()
                              .collection('bookings')
                              .where('postId', '==', postId)
                              .get()
                              .then(snapshot => {
                                snapshot.docs.forEach(doc => {
                                  doc.ref.delete().then(() => {
                                    firestore()
                                      .collection('approvedBookings')
                                      .where('postId', '==', postId)
                                      .get()
                                      .then(snapshot => {
                                        snapshot.docs.forEach(doc => {
                                          doc.ref.delete();
                                        });
                                      });
                                  });
                                });
                              });
                          });
                        });
                      });
                  });
                });
              });
          })
          .then(() => {
            setModalVisible(true);
            setModalMessage('You have permanently deleted the post.');
            setConfirmVisible(false);
            handleAction();
          })
          .catch(err => {
            console.log(err);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });
      })
      .catch(err => {
        console.log(err);
        setModalVisible(true);
        setModalMessage('Something went wrong. Please try again later.');
      });
  }

  function onChangeState() {
    setModalVisible(false);
  }

  function onDeleteClicked() {
    setConfirmVisible(true);
    setConfirmMessage('Are you sure you want to delete this post permanently?');
  }

  return (
    <View style={styles.modalContainer}>
      <ConfirmModal
        yesText="Yes"
        noText="No"
        visible={confirmVisible}
        message={confirmMessage}
        onConfirmNo={onConfirmNo}
        onConfirmYes={onConfirmYes}
      />
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onChangeState={onChangeState}
      />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          onDropdownClose(),
            navigation.navigate('EditPost', {
              postDetails: postDetails,
              postId: postId,
            });
        }}>
        <View style={styles.modalTextContainer}>
          <Text style={styles.modalText}>Edit the post</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onDeleteClicked()}>
        <View style={styles.modalTextContainer}>
          <Text style={styles.modalText}>Delete the post</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default PostTrigger;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    top: hp('4%'),
    marginRight: wp('2.7%'),
    padding: wp('2.5%'),
    elevation: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    zIndex: 999,
  },
  modalTextContainer: {
    padding: wp('1%'),
  },
  modalText: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
