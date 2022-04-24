import React from 'react';
import {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../components/buttons/CustomButton';
import CustomTextInput from '../components/forms/CustomTextInput';
import HeaderText from '../components/texts/HeaderText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/loaders/Loader';
import AlertModal from '../components/alert/AlertModal';
import images from '../constants/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  function onChangeState() {
    setModalVisible(false);
  }

  const handleSignIn = (email, password) => {
    if (email.length == 0 || password.length == 0) {
      setModalVisible(true);
      setModalMessage('Email or password field cannot be empty.');
      return;
    } else if (password.length < 7) {
      setModalVisible(true);
      setModalMessage('Password must be at least of 7 characters.');
    } else {
      setIsLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          var userId = res.user.uid;
          firestore()
            .collection('users')
            .where('userId', '==', userId)
            .onSnapshot(snapshot => {
              snapshot.docs.map(doc => {
                const userDocId = doc.id;
                const data = doc.data();
                const phoneNumberVerified = data.phoneNumberVerified;
                if (phoneNumberVerified == false) {
                  navigation.navigate('VerifyPhoneNumber', {
                    userDocId: userDocId,
                  });
                  setIsLoading(false);
                }
              });
            });
          setIsLoading(false);
        })
        .catch(e => {
          setModalVisible(true);
          if (e.code === 'auth/invalid-email') {
            setModalMessage(
              'The provided value for the email user property is invalid.',
            );
          } else if (e.code === 'auth/user-not-found') {
            setModalMessage(
              'There is no user record correspondinng to this identifier. The user may have been deleted.',
            );
          } else if (e.code === 'auth/wrong-password') {
            setModalMessage('The password is incorrect.');
          } else {
            setModalMessage(e.message);
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
        <View style={styles.loginContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={images.logo}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </View>
          <View style={styles.logInForm}>
            <HeaderText headerText="Log In" />
            <CustomTextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCompleteType="email"
              textContentType="emailAddress"
              onChangeText={email => setEmail(email)}
            />

            <CustomTextInput
              placeholder="Password"
              name="password"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry={hidePassword}
              onChangeText={password => setPassword(password)}
              type="password"
              status={hidePassword}
              onPress={() => setHidePassword(!hidePassword)}
            />
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={[style.normalText, {color: '#F6897F'}]}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <Loader />
            ) : (
              <CustomButton
                buttonName="Log In"
                onpress={() => handleSignIn(email, password)}
              />
            )}

            <View style={styles.row}>
              <Text>
                <Text style={style.normalText}>
                  Don't have an account? Create one.
                </Text>

                <Text
                  style={[style.normalText, {color: '#F6897F'}]}
                  onPress={() => navigation.navigate('SignUp')}>
                  {' '}
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  logInForm: {
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
    marginTop: hp('3%'),
  },
  forgotPasswordContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
