import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../components/buttons/CustomButton';
import CustomTextInput from '../components/forms/CustomTextInput';
import HeaderText from '../components/texts/HeaderText';
import AlertModal from '../components/alert/AlertModal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/loaders/Loader';
import images from '../constants/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [countryCodeVisible, setCountryCodeVisible] = useState(false);
  const countryCode = '+977';

  function onChangeState() {
    setModalVisible(false);
  }

  const handleSignUp = async (
    name,
    location,
    email,
    phoneNumber,
    password,
    confirm_password,
  ) => {
    if (
      name.length == 0 ||
      location.length == 0 ||
      email.length == 0 ||
      phoneNumber.length == 0 ||
      password.length == 0 ||
      confirm_password.length == 0
    ) {
      setModalVisible(true);
      setModalMessage('Fields cannot be empty. Please fill the entire form.');
    } else if (password.length < 7) {
      setModalVisible(true);
      setModalMessage('Password must be at least of 7 characters.');
    } else if (password !== confirm_password) {
      setModalVisible(true);
      setModalMessage(
        'Value in confirm password must be same as in password field.',
      );
    } else if (phoneNumber.length !== 10) {
      setModalVisible(true);
      setModalMessage('Mobile number must be of 10 digits.');
    } else {
      setIsLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          var userId = res.user.uid;
          firestore()
            .collection('users')
            .add({
              timestamp: firestore.FieldValue.serverTimestamp(),
              name: name,
              location: location,
              email: email,
              phoneNumber: countryCode + phoneNumber,
              phoneNumberVerified: false,
              userId: userId,
              numberOfPosts: 0,
              numberOfBookings: 0,
              numberOfSavedPosts: 0,
              userImage:
                'https://firebasestorage.googleapis.com/v0/b/roommate-3d4ee.appspot.com/o/usersImage%2Fced87092-2110-4a53-bf2f-fdecb3673aae.jpg?alt=media&token=2dbb63dc-c1f7-43e4-b96e-208aefec55ae',
            })

            .catch(err => {
              setModalVisible(true);
              setModalMessage(err.message);
              setIsLoading(false);
            });
        })
        .then(() => {
          auth()
            .signOut()
            .then(() => {
              setIsLoading(false),
                setModalVisible(true),
                setModalMessage('Your account has been created. Please login.');
              navigation.navigate('LogIn');
            });
        })
        .catch(err => {
          setModalVisible(true);
          if (err.code === 'auth/email-already-in-use') {
            setModalMessage(
              'The email address ia already in use by another account. Please provide another email address.',
            );
          } else if (err.code === 'auth/invalid-email') {
            setModalMessage(
              'The provided value for the email user property is invalid.',
            );
          } else {
            setModalMessage(err.message);
          }
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={style.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AlertModal
          visible={modalVisible}
          message={modalMessage}
          onChangeState={onChangeState}
        />
        <View style={styles.signUpContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={images.logo}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </View>
          <View style={styles.signUpForm}>
            <HeaderText headerText="Sign Up" />
            <CustomTextInput
              placeholder="Name"
              autoCompleteType="name"
              textContentType="name"
              autoCapitalize="words"
              onChangeText={name => setName(name)}
            />
            <CustomTextInput
              placeholder="Location"
              autoCapitalize="words"
              autoCompleteType="street-address"
              textContentType="addressCityAndState"
              onChangeText={location => setLocation(location)}
            />
            <CustomTextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCompleteType="email"
              textContentType="emailAddress"
              onChangeText={email => setEmail(email)}
            />

            <View style={styles.mobile}>
              {(countryCodeVisible || phoneNumber !== '') && (
                <Text style={styles.countryCode}>{countryCode}</Text>
              )}
              <TextInput
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                placeholderTextColor="#F6897F"
                style={styles.textInput}
                onFocus={() => setCountryCodeVisible(true)}
              />
            </View>

            <CustomTextInput
              placeholder="Password"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry={hidePassword}
              onChangeText={password => setPassword(password)}
              type="password"
              status={hidePassword}
              onPress={() => setHidePassword(!hidePassword)}
            />

            <CustomTextInput
              placeholder="Confirm Password"
              secureTextEntry={hideConfirmPassword}
              autoCompleteType="password"
              textContentType="password"
              onChangeText={confirm_password =>
                setConfirm_password(confirm_password)
              }
              type="password"
              status={hideConfirmPassword}
              onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
            />

            {isLoading ? (
              <Loader />
            ) : (
              <CustomButton
                buttonName="Sign Up"
                onpress={() =>
                  handleSignUp(
                    name,
                    location,
                    email,
                    phoneNumber,
                    password,
                    confirm_password,
                  )
                }
              />
            )}

            <View style={styles.row}>
              <Text>
                <Text style={style.normalText}>Already have an account?</Text>

                <Text
                  style={[style.normalText, {color: '#F6897F'}]}
                  onPress={() => navigation.pop()}>
                  {' '}
                  Log In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signUpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('3%'),
    paddingBottom: hp('3%'),
  },
  signUpForm: {
    paddingTop: hp('1.5%'),
    width: wp('85%'),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('50%'),
    elevation: 1,
    height: wp('20%'),
    width: wp('20%'),
    backgroundColor: 'white',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
    marginTop: hp('3%'),
  },
  mobile: {
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    width: wp('85%'),
  },
  textInput: {
    height: hp('7%'),
    width: wp('75%'),
    color: '#F6897F',
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
  },
  countryCode: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
    color: '#F6897F',
  },
});
