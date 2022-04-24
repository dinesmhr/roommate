import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../components/buttons/CustomButton';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import Loading from '../components/loaders/Loading';
import Loader from '../components/loaders/Loader';
import {UserContext, ActionContext} from '../components/UserContext';
import AlertModal from '../components/alert/AlertModal';
import ConfirmModal from '../components/alert/ConfirmModal';
import PropertyDescription from '../components/details/PropertyDescription';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const RoomDetails = ({navigation, route}) => {
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const currentUser = useContext(UserContext);
  const [userDocId, setUserDocId] = useState('');
  const [postImagesUrl, setPostImagesUrl] = useState([]);
  const docId = route.params.postId;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const {handleAction} = useContext(ActionContext);

  useEffect(() => {
    var unsubscribe;
    if (docId) {
      unsubscribe = firestore()
        .collection('posts')
        .doc(docId)
        .onSnapshot(snapshot => {
          var dat = snapshot.data();
          if (dat) {
            setDetails(dat);
            setPostImagesUrl(dat.images);
          }
          setIsLoading(false);
        });
    }
    return () => {
      unsubscribe;
    };
  }, [docId]);

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('users')
        .where('userId', '==', currentUser.uid)
        .onSnapshot(snapshot => {
          snapshot.docs.map(doc => {
            setUserDocId(doc.id);
          });
        });
    }
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('saved')
        .where('saverId', '==', currentUser.uid)
        .where('postId', '==', docId)
        .onSnapshot(snapshots => {
          snapshots.docs.map(doc => {
            if (doc.exists) {
              setIsSaved(true);
            }
          });
        });
    }
    return () => {
      unsubscribe;
    };
  }, [isSaved]);

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('bookings')
        .where('bookerId', '==', currentUser.uid)
        .where('postId', '==', docId)
        .onSnapshot(snapshots => {
          snapshots.docs.map(doc => {
            if (doc.exists) {
              setIsBooked(true);
            }
          });
        });
    }
    return () => {
      unsubscribe;
    };
  }, [isBooked]);

  const handleBooking = () => {
    if (!currentUser) {
      setModalVisible(true);
      setModalMessage('Please login to book the property.');
    } else {
      setIsLoader(true);
      firestore()
        .collection('bookings')
        .add({
          timestamp: firestore.FieldValue.serverTimestamp(),
          bookerDocId: userDocId,
          bookerId: currentUser.uid,
          postId: docId,
          postOwnerId: details.postOwnerId,
          postOwnerDocId: details.postOwnerDocId,
          title: details.title,
          location: details.location,
          rate: details.rate,
          type: details.type,
          numberOfRooms: details.numberOfRooms,
          numberOfRoommates: details.numberOfRoommates,
          numberOfBedrooms: details.numberOfBedrooms,
          features: details.features,
          description: details.description,
          images: details.images,
        })
        .then(() => {
          firestore()
            .collection('notifications')
            .add({
              timestamp: firestore.FieldValue.serverTimestamp(),
              postId: docId,
              postOwnerId: details.postOwnerId,
              fromUserId: currentUser.uid,
              fromUserDocId: userDocId,
              toUserId: details.postOwnerId,
              toUserDocId: details.postOwnerDocId,
              message: 'has booked your property.',
            })
            .then(() => {
              firestore()
                .collection('users')
                .doc(userDocId)
                .update({
                  numberOfBookings: firestore.FieldValue.increment(1),
                })
                .catch(err => {
                  setModalVisible(true);
                  setModalMessage(
                    'There was a problem booking this property. Please try again later.',
                  );
                  setIsLoader(false);
                });
            })
            .then(() => {
              setIsLoader(false);
              setModalVisible(true);
              setModalMessage('You have booked the property.');
            })
            .catch(error => {
              setModalVisible(true);
              setModalMessage(
                'There was a problem booking this property. Please try again later.',
              );
              setIsLoader(false);
            });
        })
        .catch(error => {
          setModalVisible(true);
          setModalMessage(
            'There was a problem booking this property. Please try again later.',
          );
          setIsLoader(false);
        });
    }
  };

  const handleAlreadyBooked = () => {
    setModalVisible(true);
    setModalMessage('You have already booked this property.');
  };

  const Header = ({navigation}) => {
    const [isHeartLoader, setIsHeartLoader] = useState(false);

    const saveToDb = () => {
      setIsHeartLoader(true),
        firestore()
          .collection('saved')
          .add({
            timestamp: firestore.FieldValue.serverTimestamp(),
            saverDocId: userDocId,
            saverId: currentUser.uid,
            postId: docId,
            postOwnerId: details.postOwnerId,
            postOwnerDocId: details.postOwnerDocId,
            title: details.title,
            location: details.location,
            rate: details.rate,
            type: details.type,
            bookingApproved: details.bookingApproved,
            numberOfRooms: details.numberOfRooms,
            numberOfRoommates: details.numberOfRoommates,
            numberOfBedrooms: details.numberOfBedrooms,
            features: details.features,
            description: details.description,
            images: details.images,
          })
          .then(() => {
            firestore()
              .collection('users')
              .doc(userDocId)
              .update({
                numberOfSavedPosts: firestore.FieldValue.increment(1),
              })
              .then(() => {
                setIsSaved(true);
                setIsHeartLoader(false);
                setModalVisible(true);
                setModalMessage('You have saved this post.');
              })
              .catch(err => {
                setModalVisible(true);
                setModalMessage(
                  'There was a problem saving this post. Please try again later.',
                );
                setIsHeartLoader(false);
              });
          })
          .then(() => {})
          .catch(err => {
            console.log(err);
            setModalVisible(true);
            setModalMessage(
              'There was a problem saving this post. Please try again later.',
            );
            setIsHeartLoader(false);
          });
    };

    const deleteFromDb = () => {
      setIsHeartLoader(true);
      firestore()
        .collection('saved')
        .where('saverId', '==', currentUser.uid)
        .where('postId', '==', docId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            doc.ref.delete().then(() => {
              firestore()
                .collection('users')
                .doc(userDocId)
                .update({
                  numberOfSavedPosts: firestore.FieldValue.increment(-1),
                })
                .catch(err => {
                  console.log(err);
                  setIsHeartLoader(false);
                  setModalVisible(true);
                  setModalMessage(
                    'There was a problem removing this post from your saved posts. Please try again.',
                  );
                })
                .then(() => {
                  setIsSaved(false);
                  setIsHeartLoader(false);
                  setModalVisible(true);
                  setModalMessage(
                    'This post has been removed from your saved posts.',
                  );
                })
                .catch(err => {
                  console.log(err);
                  setIsHeartLoader(false);
                  setModalVisible(true);
                  setModalMessage(
                    'There was a problem removing this post from your saved posts. Please try again.',
                  );
                });
            });
          });
        });
    };

    const Heart = () => {
      if (!currentUser) {
        return (
          <TouchableOpacity
            onPress={e => {
              setModalVisible(true);
              setModalMessage('Please login to save the post.');
            }}>
            <Feather name="heart" size={wp('8%')} color="black" />
          </TouchableOpacity>
        );
      } else if (currentUser.uid !== details.postOwnerId) {
        if (isHeartLoader) {
          return <ActivityIndicator size={wp('8%')} color="#F6897F" />;
        } else {
          if (isSaved) {
            return (
              <TouchableOpacity
                onPress={e => {
                  deleteFromDb();
                }}>
                <Feather name="heart" size={wp('8%')} color="#F6897F" />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={e => {
                  saveToDb();
                }}>
                <Feather name="heart" size={wp('8%')} color="black" />
              </TouchableOpacity>
            );
          }
        }
      } else {
        return false;
      }
    };

    return (
      <View style={style.touchableButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={wp('8%')} color="black" />
        </TouchableOpacity>
        <Heart />
      </View>
    );
  };

  const BookingButton = () => {
    if (isLoader) {
      return <Loader />;
    } else if (details.bookingApproved) {
      return (
        <CustomButton
          buttonName="Unavailable"
          onpress={() => {
            setModalVisible(true);
            setModalMessage('This property is unavailable.');
          }}
        />
      );
    } else if (isBooked) {
      return (
        <CustomButton
          buttonName="Already Booked"
          onpress={() => handleAlreadyBooked()}
        />
      );
    } else {
      return (
        <CustomButton
          buttonName="Book the property"
          onpress={() => handleBooking()}
        />
      );
    }
  };

  const EditDeleteButton = ({onPress, title, buttonColor}) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={{
          height: hp('6.5%'),
          width: wp('35%'),
          borderRadius: 20,
          backgroundColor: buttonColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.editDeleteButtonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  function onConfirmNo() {
    setConfirmVisible(false);
  }

  function onConfirmYes() {
    firestore()
      .collection('posts')
      .doc(docId)
      .delete()
      .then(() => {
        firestore()
          .collection('users')
          .doc(details.postOwnerDocId)
          .update({
            numberOfPosts: firestore.FieldValue.increment(-1),
          })
          .then(() => {
            firestore()
              .collection('notifications')
              .where('postId', '==', docId)
              .get()
              .then(snapshot => {
                snapshot.docs.forEach(doc => {
                  doc.ref.delete().then(() => {
                    firestore()
                      .collection('bookings')
                      .where('postId', '==', docId)
                      .get()
                      .then(snapshot => {
                        snapshot.docs.forEach(doc => {
                          doc.ref.delete().then(() => {
                            firestore()
                              .collection('approvedBookings')
                              .where('postId', '==', docId)
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
          })
          .catch(err => {
            console.log(err);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });
      })
      .then(() => {
        navigation.navigate('Home');
        handleAction();
        setModalVisible(true);
        setModalMessage('You have permanently deleted the post.');
        setConfirmVisible(false);
      })
      .catch(err => console.log(err));
  }

  function onChangeState() {
    setModalVisible(false);
  }

  return (
    <View style={style.mainContainer}>
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
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={styles.detailsContainer}>
            <PropertyDescription
              imageUrl={postImagesUrl}
              title={details.title}
              location={details.location}
              rate={details.rate}
              numberOfRooms={details.numberOfRooms}
              numberOfRoommates={details.numberOfRoommates}
              numberOfBedrooms={details.numberOfBedrooms}
              type={details.type}
              features={details.features}
              description={details.description}
            />
            <View>
              {currentUser && (
                <>
                  {currentUser.uid !== details.postOwnerId ? (
                    <BookingButton />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: hp('2.5%'),
                      }}>
                      <EditDeleteButton
                        title="Edit the post"
                        buttonColor="green"
                        onPress={() =>
                          navigation.navigate('EditPost', {
                            postDetails: details,
                            postId: docId,
                          })
                        }
                      />
                      <EditDeleteButton
                        title="Delete the post"
                        buttonColor="red"
                        onPress={() => {
                          setConfirmVisible(true);
                          setConfirmMessage(
                            'Are you sure you want to delete this post permanently?',
                          );
                        }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RoomDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    paddingBottom: hp('3%'),
  },
  editDeleteButtonText: {
    color: 'white',
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
  },
});
