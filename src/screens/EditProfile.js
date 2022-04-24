import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import HeaderButton from '../components/buttons/HeaderButton';
import CustomButton from '../components/buttons/CustomButton';
import Feather from 'react-native-vector-icons/Feather';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../components/loaders/Loader';
import FormInput from '../components/forms/FormInput';
import AlertModal from '../components/alert/AlertModal';
import ConfirmModal from '../components/alert/ConfirmModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const EditProfile = ({navigation, route}) => {
  const name = route.params.userName;
  const location = route.params.userLocation;
  const userImage = route.params.userImage;
  const userDocId = route.params.userDocId;
  const [editedName, setEditedName] = useState(name);
  const [editedLocation, setEditedLocation] = useState(location);
  const [imagePath, setImagePath] = useState(userImage);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  function onChangeState() {
    setModalVisible(false);
  }

  function onConfirmNo() {
    setConfirmVisible(false);
  }

  async function onConfirmYes() {
    Linking.openSettings();
    setConfirmVisible(false);
  }

  async function selectCropImage() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true,
          compressImageQuality: 0.7,
        })
          .then(response => {
            const path = response.path;
            setImagePath(path);
          })
          .catch(err => {
            setModalVisible(true);
            setModalMessage('Something went wrong. Please try again later.');
          });
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setConfirmVisible(true);
        setConfirmMessage(
          'Please grant storage permission manually or clear all app data',
        );
      }
    } catch (err) {
      setModalVisible(true);
      setModalMessage('Something went wrong. Please try again later.');
    }
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const filePath = imagePath;
      const uploadUri = await fetch(imagePath);
      const blob = await uploadUri.blob();
      var filename = filePath.substring(filePath.lastIndexOf('/') + 1);

      const uploadTask = storage().ref(`usersImage/${filename}`);
      await uploadTask.put(blob).catch(e => {
        console.log(e);
        setIsLoading(false);
        setModalVisible(true);
        setModalMessage('Something went wrong. Please try again later.');
      });
      await uploadTask.getDownloadURL().then(async downloadURL => {
        await firestore()
          .collection('users')
          .doc(userDocId)
          .update({
            name: editedName,
            location: editedLocation,
            userImage: downloadURL,
          })
          .then(() => {
            setIsLoading(false);
            setModalVisible(true);
            setModalMessage('Your details were updated');
          })
          .catch(error => {
            setModalVisible(true);
            setModalMessage(error.message);
          });
      });
    } catch (e) {
      setModalVisible(true);
      setModalMessage(e.message);
    }
  }

  return (
    <View style={style.mainContainer}>
      <HeaderButton
        onPress={() => navigation.goBack()}
        titleText="Edit Profile"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <View style={styles.editContainer}>
          <View style={styles.center}>
            <ImageBackground
              source={{uri: imagePath}}
              style={{
                height: wp('25%'),
                width: wp('25%'),
              }}
              imageStyle={{
                borderRadius: wp('50%'),
                borderWidth: 2,
                borderColor: '#F6897F',
              }}>
              <View style={styles.camera}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => selectCropImage()}>
                  <Feather
                    name="camera"
                    color="white"
                    size={wp('5.5%')}
                    style={styles.featherIcon}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.formContainer}>
            <FormInput
              title="Name"
              value={editedName}
              onChangeText={val => setEditedName(val)}
            />
            <FormInput
              title="Location"
              value={editedLocation}
              onChangeText={val => setEditedLocation(val)}
            />
          </View>

          {isLoading ? (
            <Loader />
          ) : (
            <CustomButton buttonName="Submit" onpress={() => handleSubmit()} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  editContainer: {
    paddingTop: hp('2%'),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('1%'),
  },
  title: {
    paddingBottom: hp('1%'),
  },

  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    marginHorizontal: wp('4.5%'),
    marginTop: hp('2%'),
  },
  featherIcon: {
    backgroundColor: '#F6897F',
    borderRadius: 50,
    height: wp('8%'),
    width: wp('8%'),
    textAlign: 'center',
    paddingTop: wp('1%'),
  },
});
