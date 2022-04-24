import moment from 'moment';
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActionContext} from '../UserContext';

const NotificationCard = ({
  postId,
  message,
  timestamp,
  postOwnerId,
  fromUserId,
  fromUserDocId,
  navigation,
}) => {
  const [postDetails, setPostDetails] = useState([]);
  const [fromUserDetails, setFromUserDetails] = useState([]);
  const [postImages, setPostImages] = useState([]);
  const action = useContext(ActionContext);

  useEffect(() => {
    var unsubscribe;
    if (postId) {
      unsubscribe = firestore()
        .collection('posts')
        .doc(postId)
        .onSnapshot(doc => {
          const datu = doc.data();

          if (datu) {
            setPostImages(datu.images);
            setPostDetails(datu);
          }
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    var unsubscribe;
    if (fromUserDocId) {
      unsubscribe = firestore()
        .collection('users')
        .doc(fromUserDocId)
        .onSnapshot(doc => {
          const data = doc.data();
          setFromUserDetails(data);
        });
    }
    return () => {
      unsubscribe();
    };
  }, [fromUserDocId]);

  return (
    <>
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('UserProfile', {
              userDetails: fromUserDetails,
            })
          }>
          <Image
            style={styles.userImage}
            source={{uri: fromUserDetails.userImage}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('PropertyDetails', {
              propertyDetails: postDetails,
              fromUserDetails: fromUserDetails,
              postId: postId,
              fromUserId: fromUserDetails.userId,
              fromUserDocId: fromUserDocId,
              timestamp: timestamp,
              message: message,
            })
          }>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={styles.messageContainer}>
              <Text style={styles.notificatiionText}>
                <Text style={{textTransform: 'capitalize'}}>
                  {fromUserDetails.name}{' '}
                </Text>

                <Text>{message}</Text>
              </Text>
              <Text style={styles.time}>
                {moment(timestamp.toDate()).format('llll')}
              </Text>
            </View>

            <Image
              source={{uri: postImages[0]}}
              resizeMode="cover"
              style={styles.img}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  notificationContainer: {
    width: wp('90%'),
    backgroundColor: 'white',
    elevation: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: wp('1.5%'),
    marginBottom: wp('1.5%'),
    borderRadius: 18,
  },
  userImage: {
    height: wp('13%'),
    width: wp('13%'),
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  img: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 10,
  },
  messageContainer: {
    paddingHorizontal: wp('2%'),
    width: wp('58%'),
  },
  notificatiionText: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
    color: 'black',
  },
  time: {
    fontFamily: 'Segoe UI',
    fontSize: wp('4%'),
    color: '#F6897F',
  },
});
