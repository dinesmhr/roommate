import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {UserContext} from '../components/UserContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../components/buttons/CustomButton';
import Loading from '../components/loaders/Loading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import Loader from '../components/loaders/Loader';
import AlertModal from '../components/alert/AlertModal';
import style from '../css/styles';

const VerifyPhoneNumber = ({navigation, route}) => {
  const userDocId = route.params.userDocId;
  const [phoneNumber, setPhoneNumber] = useState('');
  var [newPhoneNumber, setNewPhoneNumber] = useState('');
  const currentUser = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState(null);
  const [credential, setCredential] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('users')
        .doc(userDocId)
        .onSnapshot(snapshot => {
          const data = snapshot.data();
          setPhoneNumber(data.phoneNumber);
        });
      setIsLoading(false);
    }
    return () => {
      unsubscribe;
    };
  }, [userDocId]);

  function onChangeState() {
    setModalVisible(false);
  }

  const handleVerify = () => {
    setIsVerifying(true);
    if (newPhoneNumber == '') {
      newPhoneNumber = phoneNumber;
    }

    if (newPhoneNumber) {
      auth()
        .verifyPhoneNumber(newPhoneNumber)
        .on(
          'state_changed',
          phoneAuthSnapshot => {
            const {verificationId, code} = phoneAuthSnapshot;
            const credential = auth.PhoneAuthProvider.credential(
              verificationId,
              code,
            );

            setVerificationId(verificationId);
            setCode(code);
            setCredential(credential);

            switch (phoneAuthSnapshot.state) {
              case auth.PhoneAuthState.CODE_SENT:
                setModalVisible(true);
                setModalMessage('Code Sent');
                setCodeSent(true);
                setIsVerifying(false);
                break;
              case auth.PhoneAuthState.ERROR:
                setModalVisible(true);
                setModalMessage('Some error occured. Please try again later.');
                setIsVerifying(false);
                break;
              case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
                setIsVerifying(false);
                break;
              case auth.PhoneAuthState.AUTO_VERIFIED:
                const credential2 = credential;
                auth()
                  .currentUser.linkWithCredential(credential2)
                  .then(() => {
                    alert('verification Success');
                    firestore()
                      .collection('users')
                      .doc(userDocId)
                      .update({
                        phoneNumber: newPhoneNumber,
                        phoneNumberVerified: true,
                      })
                      .then(() => {
                        navigation.navigate('Home');
                      })
                      .catch(err => {
                        setModalVisible(true);
                        setModalMessage(err.message);
                        setIsVerifying(false);
                      });
                  })
                  .catch(error => {
                    if (error.code === 'auth/credential-already-in-use') {
                      setModalVisible(true);
                      setModalMessage(
                        'Phone number is already linked with another account.',
                      );
                      setIsVerifying(false);
                    } else {
                      setModalVisible(true);
                      setModalMessage(
                        'Something went wrong. Please try again later.',
                      );
                      setIsVerifying(false);
                    }
                  });
                break;
            }
          },
          error => {
            if (error.code === 'auth/unknown') {
              setModalVisible(true);
              setModalMessage('Too many attempts. Please try again later');
              setIsVerifying(false);
            }
          },
        )
        .catch(error => {
          if (error.code === 'auth/invalid-phone-number') {
            setModalVisible(true);
            setModalMessage('Please enter your valid mobile number');
            setIsVerifying(false);
          }
        });
    } else {
      setModalVisible(true);
      setModalMessage('Enter your mobile number');
      setIsVerifying(false);
    }
  };

  async function confirmCode() {
    setIsConfirming(true);

    if (newPhoneNumber == '') {
      newPhoneNumber = phoneNumber;
    }
    if (code) {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      await auth()
        .currentUser.linkWithCredential(credential)
        .then(() => {
          firestore()
            .collection('users')
            .doc(userDocId)
            .update({
              phoneNumber: newPhoneNumber,
              phoneNumberVerified: true,
            })
            .then(() => {
              navigation.navigate('Home');
              setModalVisible(true);
              setModalMessage('Verification success.');
              setIsConfirming(false);
            });
        })
        .catch(error => {
          if (error.code === 'auth/credential-already-in-use') {
            setModalVisible(true);
            setModalMessage(
              'Phone number is already linked with another account.',
            );
            setIsConfirming(false);
            setCodeSent(false);
          } else if (error.code == 'auth/invalid-verification-code') {
            setModalVisible(true);
            setModalMessage('Invalid code');
            setIsConfirming(false);
            setIsCodeSent(false);
          } else {
            setModalVisible(true);
            setModalMessage('Account linking error');
            setIsConfirming(false);
            setIsCodeSent(false);
          }
        });
    } else {
      setModalVisible(true);
      setModalMessage('Enter the code');
      setIsConfirming(false);
    }
  }

  const handlePhoneNumber = val => {
    setNewPhoneNumber(val);
    setPhoneNumber(val);
  };

  return (
    <View style={styles.mainContainer}>
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onChangeState={onChangeState}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!codeSent ? (
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Phone Verification</Text>
              <Text style={style.normalText}>Enter your mobile number:</Text>
              <TextInput
                placeholder="Type here"
                placeholderTextColor="#F6897F"
                value={phoneNumber}
                keyboardType="phone-pad"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                onChangeText={val => handlePhoneNumber(val)}
                style={styles.inputText}
              />
              <>
                {!isVerifying ? (
                  <CustomButton
                    buttonName="Verify"
                    onpress={() => handleVerify()}
                  />
                ) : (
                  <Loader />
                )}
              </>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Phone Verification</Text>
              <Text style={style.normalText}>Enter the code:</Text>

              <TextInput
                placeholder="Type here"
                placeholderTextColor="#F6897F"
                autoCompleteType="off"
                value={code}
                keyboardType="phone-pad"
                onChangeText={val => setCode(val)}
                style={styles.inputText}
              />
              <>
                {!isConfirming ? (
                  <CustomButton
                    buttonName="Confirm"
                    onpress={() => confirmCode()}
                  />
                ) : (
                  <Loader />
                )}
              </>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default VerifyPhoneNumber;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {},
  heading: {
    fontFamily: 'AvantGardeDemiBT',
    fontSize: wp('7%'),
    color: 'black',
    paddingBottom: hp('2%'),
  },
  inputText: {
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
    height: hp('6.5%'),
    width: wp('79%'),
    color: '#F6897F',
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    alignItems: 'center',
    marginBottom: hp('2%'),

    width: wp('85%'),
  },
});
