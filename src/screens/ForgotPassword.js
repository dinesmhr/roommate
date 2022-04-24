import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '../components/buttons/CustomButton';
import auth from '@react-native-firebase/auth';
import Loader from '../components/loaders/Loader';
import AlertModal from '../components/alert/AlertModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TitleText from '../components/texts/TitleText';
import CustomTextInput from '../components/forms/CustomTextInput';
import HeaderButton from '../components/buttons/HeaderButton';
import style from '../css/styles';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  function onChangeState() {
    setModalVisible(false);
  }

  const handleSubmit = () => {
    if (email.length == 0) {
      setModalVisible(true);
      setModalMessage('Please enter your email address');
    } else {
      setIsLoader(true);
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setIsLoader(false);
          setIsSent(true);
          setModalVisible(true);
          setModalMessage(
            'Password reset email was sent to your email address.',
          );
        })
        .catch(function (error) {
          setModalVisible(true);
          setModalMessage('Something went wrong. Please try again later.');
          setIsLoader(false);
        });
    }
  };

  const SendEmailButton = () => {
    if (isLoader) {
      return <Loader />;
    } else if (isSent) {
      return <CustomButton buttonName="Password Reset Email Sent" />;
    } else {
      return (
        <CustomButton
          buttonName="Send Password Reset Email"
          onpress={() => handleSubmit()}
        />
      );
    }
  };

  return (
    <View style={style.mainContainer}>
      <HeaderButton onPress={() => navigation.goBack()} />
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onChangeState={onChangeState}
      />

      <View style={styles.formContainer}>
        <View>
          <View style={styles.heading}>
            <TitleText titleText="Enter your email address" />
          </View>

          <CustomTextInput
            placeholder="Type here.."
            keyboardType="email-address"
            autoCompleteType="email"
            textContentType="emailAddress"
            onChangeText={email => setEmail(email)}
          />

          <SendEmailButton />
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    paddingBottom: hp('1.5%'),
  },
});
