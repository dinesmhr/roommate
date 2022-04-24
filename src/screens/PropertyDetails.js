import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PropertyDescription from '../components/details/PropertyDescription';
import AlertModal from '../components/alert/AlertModal';
import Loading from '../components/loaders/Loading';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import {UserContext, ActionContext} from '../components/UserContext';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const PropertyDetails = ({route, navigation}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const currentUser = useContext(UserContext);
  const propertyDetails = route.params.propertyDetails;
  const fromUserDetails = route.params.fromUserDetails;
  const phoneNumber = fromUserDetails.phoneNumber;
  const postId = route.params.postId;
  const fromUserDocId = route.params.fromUserDocId;
  const fromUserId = route.params.fromUserId;
  const message = route.params.message;
  const timestamp = route.params.timestamp;
  const {handleAction} = useContext(ActionContext);

  useEffect(() => {
    propertyDetails && setImageUrls(propertyDetails.images);
  }, []);

  useEffect(() => {
    var unsubscribe;
    if (fromUserId) {
      unsubscribe = firestore()
        .collection('approvedBookings')
        .where('bookerId', '==', fromUserId)
        .where('postId', '==', postId)
        .onSnapshot(snapshots => {
          snapshots.docs.map(doc => {
            if (doc.exists) {
              setIsApproved(true);
            }
          });
        });
      setIsLoading(false);
    }
    return () => {
      unsubscribe;
    };
  }, []);

  const ApproveLoader = () => (
    <View style={styles.headerButtonContainer}>
      <ActivityIndicator size={wp('8%')} color="white" />
    </View>
  );

  const Approve = ({onPress, approveText}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.headerButtonContainer}>
        <Text style={[style.normalText, {color: 'white'}]}>{approveText}</Text>
      </View>
    </TouchableOpacity>
  );

  function onChangeState() {
    setModalVisible(false);
  }

  function handleApprove() {
    setIsLoader(true);
    firestore()
      .collection('approvedBookings')
      .add({
        timestamp: firestore.FieldValue.serverTimestamp(),
        bookerDocId: fromUserDocId,
        bookerId: fromUserDetails.userId,
        postId: postId,
        postOwnerId: propertyDetails.postOwnerId,
        postOwnerDocId: propertyDetails.postOwnerDocId,
        title: propertyDetails.title,
        location: propertyDetails.location,
        rate: propertyDetails.rate,
        type: propertyDetails.type,
        numberOfRooms: propertyDetails.numberOfRooms,
        numberOfRoommates: propertyDetails.numberOfRoommates,
        numberOfBedrooms: propertyDetails.numberOfBedrooms,
        features: propertyDetails.features,
        description: propertyDetails.description,
        images: propertyDetails.images,
      })
      .then(() => {
        firestore().collection('notifications').add({
          timestamp: firestore.FieldValue.serverTimestamp(),
          postId: postId,
          postOwnerId: propertyDetails.postOwnerId,
          fromUserId: propertyDetails.postOwnerId,
          fromUserDocId: propertyDetails.postOwnerDocId,
          toUserId: fromUserId,
          toUserDocId: fromUserDocId,
          message: 'has approved your booking.',
        });
      })
      .then(() => {
        firestore().collection('posts').doc(postId).update({
          bookingApproved: true,
        });
      })
      .then(() => {
        firestore()
          .collection('saved')
          .where('postId', '==', postId)
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(doc => {
              doc.ref.update({
                bookingApproved: true,
              });
            });
          });
      })
      .then(() => {
        setIsLoader(false);
        setModalVisible(true);
        setModalMessage('The booking has been approved.');
        handleAction();
      })
      .catch(error => {
        setIsLoader(false);
        setModalVisible(true);
        setModalMessage('Something went wrong. Please try again later.');
        console.log(error);
      });
  }

  function handleAlreadyApproved() {
    setModalVisible(true);
    setModalMessage('You have already approved this booking.');
  }
  const ApproveButton = () => {
    if (isLoader) {
      return <ApproveLoader />;
    } else {
      if (isApproved) {
        return (
          <Approve
            onPress={() => handleAlreadyApproved()}
            approveText="Approved"
          />
        );
      } else {
        return (
          <Approve onPress={() => handleApprove()} approveText="Approve" />
        );
      }
    }
  };

  const CallTheOwner = () => (
    <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
      <View style={styles.headerButtonContainer}>
        <Text style={[style.normalText, {color: 'white'}]}>Call the owner</Text>
      </View>
    </TouchableOpacity>
  );

  const Header = () => {
    return (
      <View style={style.touchableButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={wp('8%')} color="black" />
        </TouchableOpacity>
        {currentUser.uid === propertyDetails.postOwnerId ? (
          <ApproveButton />
        ) : (
          <CallTheOwner />
        )}
      </View>
    );
  };

  return isLoading ? (
    <Loading />
  ) : (
    <View style={style.mainContainer}>
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onChangeState={onChangeState}
      />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('UserProfile', {
                userDetails: fromUserDetails,
              })
            }>
            <View style={styles.bookerContainer}>
              <Image
                style={styles.userImage}
                source={{uri: fromUserDetails.userImage}}
              />
              <View style={styles.messageContainer}>
                <View style={styles.message}>
                  <Text style={style.normalText}>
                    <Text style={{textTransform: 'capitalize'}}>
                      {fromUserDetails.name}{' '}
                    </Text>
                    <Text>{message}</Text>
                  </Text>
                </View>

                <Text style={[style.normalText, {fontSize: wp('4%')}]}>
                  {moment(timestamp.toDate()).format('llll')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <PropertyDescription
            imageUrl={imageUrls}
            title={propertyDetails.title}
            location={propertyDetails.location}
            rate={propertyDetails.rate}
            numberOfRooms={propertyDetails.numberOfRooms}
            numberOfRoommates={propertyDetails.numberOfRoommates}
            numberOfBedrooms={propertyDetails.numberOfBedrooms}
            type={propertyDetails.type}
            features={propertyDetails.features}
            description={propertyDetails.description}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PropertyDetails;

const styles = StyleSheet.create({
  innerContainer: {
    paddingBottom: hp('3%'),
  },
  userImage: {
    height: wp('12%'),
    width: wp('12%'),
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  bookerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
  },
  headerButtonContainer: {
    padding: wp('2.5%'),
    borderRadius: 10,
    backgroundColor: '#F6897F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {width: wp('85%')},
  messageContainer: {paddingHorizontal: wp('2%')},
});
