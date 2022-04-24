import React, {useEffect, useState, useContext, useRef} from 'react';
import * as geofire from 'geofire-common';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FormInput from '../components/forms/FormInput';
import FormPicker from '../components/forms/FormPicker';
import Checks from '../components/forms/Checks';
import CustomButton from '../components/buttons/CustomButton';
import HeaderButton from '../components/buttons/HeaderButton';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import {UserContext, ActionContext} from '../components/UserContext';
import Loader from '../components/loaders/Loader';
import AlertModal from '../components/alert/AlertModal';
import ConfirmModal from '../components/alert/ConfirmModal';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Rate from '../components/forms/Rate';
import FormNumberOf from '../components/forms/FormNumberOf';
import style from '../css/styles';

const API_KEY = 'AIzaSyAlP799yL7rMFBwpcRD3L6Q7iluAoStob0';

const EditPost = ({navigation, route}) => {
  const postDetails = route.params.postDetails;
  const postId = route.params.postId;
  const [title, setTitle] = useState(postDetails.title);
  const [location, setLocation] = useState(postDetails.location);
  const [latitude, setLatitude] = useState(postDetails.latitude);
  const [longitude, setLongitude] = useState(postDetails.longitude);
  const [rate, setRate] = useState(postDetails.rate);
  const [type, setType] = useState(postDetails.type);
  const [numberOfRooms, setNumberOfRooms] = useState(postDetails.numberOfRooms);
  const [numberOfRoommates, setNumberOfRoommates] = useState(
    postDetails.numberOfRoommates,
  );
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(
    postDetails.numberOfBedrooms,
  );
  const [features, setFeatures] = useState(postDetails.features);
  const [description, setDescription] = useState(postDetails.description);
  const [images, setImages] = useState(postDetails.images);
  const [isLoading, setIsLoading] = useState(false);
  const [userDocId, setUserDocId] = useState('');
  const currentUser = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [isMounted, setIsMounted] = useState(true);

  const [featuresDefaultCondition, setFeaturesDefaultCondition] =
    useState(true);
  const {handleAction} = useContext(ActionContext);
  const ref = useRef();

  const subFeatures1 = ['Fully Furnished', 'Semi Furnished'];
  const subFeatures2 = ['Fully Furnished', 'Non Furnished'];
  const subFeatures3 = ['Semi Furnished', 'Non Furnished'];
  const subFeatures4 = ['Fully Furnished', 'Semi Furnished', 'Non Furnished'];

  useEffect(() => {
    if (isMounted) {
      ref.current?.setAddressText(location);
      setIsMounted(false);
    }
  }, [isMounted]);

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
      unsubscribe();
    };
  }, []);

  function onConfirmNo() {
    setConfirmVisible(false);
  }

  async function onConfirmYes() {
    Linking.openSettings();
    setConfirmVisible(false);
  }

  async function selectImages() {
    // Pick multiple files
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const files = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images],
        });
        var tempImages = images;
        {
          files.map(file => {
            tempImages.push(file);
          });
        }
        setImages(JSON.parse(JSON.stringify(tempImages)));
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setConfirmVisible(true);
        setConfirmMessage(
          'Please grant storage permission manually or clear all app data',
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err.message);
      } else {
        throw err;
      }
    }
  }

  //delete image from list
  function removeImage(key) {
    var tempImages = images;
    tempImages.splice(key, 1);
    setImages(JSON.parse(JSON.stringify(tempImages)));
  }

  async function pushImageToFirebase() {
    const promises = images.map(async file => {
      if (file.uri) {
        try {
          const path = await fetch(file.uri);
          const blob = await path.blob();
          const uploadTask = storage().ref(`propertyImages/${file.name}`);
          await uploadTask.put(blob).catch(e => {
            setIsLoading(false);
            console.log(e);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });
          const url = await uploadTask.getDownloadURL().catch(e => {
            setIsLoading(false);
            console.log(e);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });

          return url;
        } catch (err) {
          console.log(err);
          setIsLoading(false);
          setModalVisible(true);
          setModalMessage('Something went wrong. Please try again later.');
        }
      } else {
        return file;
      }
    });
    Promise.all(promises)
      .then(fileDownloadUrls => {
        const hashed = geofire.geohashForLocation([latitude, longitude]);
        firestore()
          .collection('posts')
          .doc(postId)
          .update({
            title: title,
            location: location,
            latitude: latitude,
            longitude: longitude,
            hash: hashed,
            rate: rate,
            type: type,
            numberOfRooms: numberOfRooms,
            numberOfRoommates: numberOfRoommates,
            numberOfBedrooms: numberOfBedrooms,
            features: features,
            description: description,
            images: fileDownloadUrls,
            postOwnerId: currentUser.uid,
            postOwnerDocId: userDocId,
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          })
          .then(() => {
            setIsLoading(false);
            setFeaturesDefaultCondition(featuresDefaultCondition);
            setModalVisible(true);
            setModalMessage('Your post was successfully updated.');
            handleAction();
          })
          .catch(error => {
            setIsLoading(false);
            console.log('Error writing document:', error);
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        setModalVisible(true);
        setModalMessage('Something went wrong. Please try again later.');
      });
  }
  function onChangeState() {
    setModalVisible(false);
  }

  const handleSubmit = () => {
    if (
      title.length == 0 ||
      location.length == 0 ||
      rate.length == 0 ||
      type.length == 0 ||
      numberOfRooms.length == 0 ||
      numberOfRoommates.length == 0 ||
      numberOfBedrooms.length == 0 ||
      features.length == 0 ||
      description.length == 0 ||
      images.length == 0
    ) {
      setModalVisible(true);
      setModalMessage('Please fill the entire form.');
    } else if (
      subFeatures1.every(elem => features.includes(elem)) ||
      subFeatures2.every(elem => features.includes(elem)) ||
      subFeatures3.every(elem => features.includes(elem)) ||
      subFeatures4.every(elem => features.includes(elem))
    ) {
      setModalVisible(true);
      setModalMessage(
        'Please choose only one feature among fully furnished, semi furnished and non furnished.',
      );
    } else {
      setIsLoading(true);
      pushImageToFirebase();
    }
  };

  return (
    <View style={style.mainContainer}>
      <ConfirmModal
        yesText="Ok"
        noText="Cancel"
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
      <HeaderButton
        onPress={() => navigation.goBack()}
        titleText="Edit Property Info"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        listViewDisplayed={false}>
        <View style={style.formContainer}>
          <View>
            <FormInput
              title="Title"
              value={title}
              autoCapitalize="sentences"
              autoCompleteType="off"
              onChangeText={text => setTitle(text)}
            />
            <View style={style.locationContainer}>
              <View style={style.locationTextView}>
                <Text style={style.normalText}>Location</Text>
              </View>

              <GooglePlacesAutocomplete
                ref={ref}
                placeholder="Search"
                textInputProps={{placeholderTextColor: '#707070'}}
                suppressDefaultStyles={true}
                styles={{
                  container: {
                    flex: 0,
                  },
                  textInputContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#F6897F',
                    paddingHorizontal: wp('2%'),
                    height: hp('5.5%'),
                    width: wp('50%'),
                    borderRadius: wp('5%'),
                    backgroundColor: 'white',
                  },
                  textInput: {
                    color: 'black',
                    fontFamily: 'Segoe UI',
                    backgroundColor: 'white',
                    width: wp('46%'),
                    height: hp('5%'),
                    paddingVertical: 0,
                    borderRadius: wp('3%'),
                    fontSize: wp('5%'),
                  },
                  listView: {
                    width: wp('50%'),
                  },
                  row: {
                    backgroundColor: 'white',

                    padding: wp('3%'),
                    // height: hp('6%'),
                  },
                  separator: {
                    height: 0.4,
                    backgroundColor: '#F6897F',
                  },
                  poweredContainer: {
                    display: 'none',
                  },
                  description: {
                    color: 'black',
                    fontFamily: 'Segoe UI',
                    fontSize: wp('4.5%'),
                  },
                }}
                fetchDetails={true}
                onPress={(data, details) => {
                  // 'details' is provided when fetchDetails = true

                  setLocation(data.description);
                  setLatitude(details.geometry.location.lat);
                  setLongitude(details.geometry.location.lng);
                }}
                query={{
                  key: API_KEY,
                  language: 'en',
                }}
              />
            </View>

            <Rate value={rate} onChangeText={text => setRate(text)} />

            <FormPicker
              title="Type"
              iconSource={require('../../assets/images/home.png')}
              placeholder="Select type"
              label1="Apartment"
              value1="Apartment"
              label2="Residence"
              value2="Residence"
              label3="House"
              value3="House"
              label4="Room"
              value4="Room"
              selectedOption={type}
              setValue={value => setType(value)}
            />

            <FormNumberOf
              title="No of Rooms"
              iconSource={require('../../assets/images/rooms.png')}
              value={numberOfRooms}
              onChangeText={text => setNumberOfRooms(text)}
            />

            <FormNumberOf
              title="No of Roommates"
              iconSource={require('../../assets/images/roommate.png')}
              value={numberOfRoommates}
              onChangeText={text => setNumberOfRoommates(text)}
            />

            <FormNumberOf
              title="No of Bedrooms"
              iconSource={require('../../assets/images/bed.png')}
              value={numberOfBedrooms}
              onChangeText={text => setNumberOfBedrooms(text)}
            />
          </View>

          <View style={style.componentContainer}>
            <View style={style.headingContainer}>
              <Text style={style.subHeading}>Features</Text>
            </View>

            <Checks
              value={featuresDefaultCondition}
              postFeatures={features}
              selectedFeature={val => setFeatures(val)}
            />
          </View>

          <View style={style.componentContainer}>
            <View style={style.headingContainer}>
              <Text style={style.subHeading}>Description</Text>
            </View>

            <View style={style.textAreaContainer}>
              <TextInput
                value={description}
                onChangeText={text => setDescription(text)}
                placeholder="Type here"
                color="black"
                placeholderTextColor="grey"
                autoCapitalize="sentences"
                autoCompleteType="off"
                mulltiLine={true}
                textAlignVertical="top"
                style={style.textArea}
              />
            </View>
          </View>
          <View>
            <View style={style.headingContainer}>
              <Text style={style.subHeading}>Upload Images</Text>
            </View>

            <View style={style.imageContainer}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => selectImages()}>
                <View style={style.uploadImage}>
                  <Feather name="plus" size={35} color="#F6897F" />
                </View>
              </TouchableOpacity>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {images.map((item, i) => {
                  var imageUrl;
                  {
                    item.uri ? (imageUrl = item.uri) : (imageUrl = item);
                  }
                  return (
                    <View style={style.imageContainer} key={i}>
                      <Image
                        style={style.uploadedImage}
                        source={{uri: imageUrl}}
                      />

                      <View style={style.imageDeleteContainer}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => removeImage(i)}>
                          <View style={style.imageDeleteIcon}>
                            <AntDesign
                              name="delete"
                              size={wp('3.5%')}
                              color="white"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            {isLoading ? (
              <Loader />
            ) : (
              <CustomButton
                buttonName="Update"
                onpress={() => handleSubmit()}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPost;
