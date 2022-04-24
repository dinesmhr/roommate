import React, {useState, useContext} from 'react';
import {RefreshControl, StyleSheet, View, ScrollView} from 'react-native';
import {UserContext} from '../components/UserContext';
import HeaderButton from '../components/buttons/HeaderButton';
import auth from '@react-native-firebase/auth';
import CustomTextInput from '../components/forms/CustomTextInput';
import AlertModal from '../components/alert/AlertModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../components/loaders/Loader';
import CustomButton from '../components/buttons/CustomButton';
import style from '../css/styles';

const ChangePassword = ({navigation}) => {
  const currentUser = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  function onChangeState() {
    setModalVisible(false);
  }

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleSubmit = () => {
    if (
      currentPassword.length === 0 ||
      newPassword.length === 0 ||
      confirmNewPassword.length === 0
    ) {
      setModalVisible(true);
      setModalMessage('Please fill the entire form');
    } else if (newPassword.length < 7) {
      setModalVisible(true);
      setModalMessage('Password must be atleast 7 characters long.');
    } else if (newPassword !== confirmNewPassword) {
      setModalVisible(true);
      setModalMessage(
        'Your new password and confirm new password must be same.',
      );
    } else {
      var user = auth().currentUser;
      var credentials = auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      user
        .reauthenticateWithCredential(credentials)
        .then(function () {
          setIsLoader(true);
          currentUser
            .updatePassword(newPassword)
            .then(() => {
              setIsLoader(false);
              setModalVisible(true);
              setModalMessage('Your password was changed successfully.');
            })
            .catch(error => {
              setModalVisible(true);
              setModalMessage(error.message);
            });
        })
        .catch(function (error) {
          setModalVisible(true);
          setModalMessage(error.message);
        });
    }
  };

  return (
    <View style={style.mainContainer}>
      <HeaderButton
        onPress={() => navigation.goBack()}
        titleText="Change the password"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="#F6897F"
          />
        }>
        <AlertModal
          visible={modalVisible}
          message={modalMessage}
          onChangeState={onChangeState}
        />
        <View style={styles.formContainer}>
          <View>
            <CustomTextInput
              placeholder="Enter your current password"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry={hideCurrentPassword}
              onChangeText={password => setCurrentPassword(password)}
              type="password"
              status={hideCurrentPassword}
              onPress={() => setHideCurrentPassword(!hideCurrentPassword)}
            />

            <CustomTextInput
              placeholder="Enter new password"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry={hideNewPassword}
              onChangeText={password => setNewPassword(password)}
              type="password"
              status={hideNewPassword}
              onPress={() => setHideNewPassword(!hideNewPassword)}
            />
            <CustomTextInput
              placeholder="Re-enter your new password"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry={hideConfirmNewPassword}
              onChangeText={password => setConfirmNewPassword(password)}
              type="password"
              status={hideConfirmNewPassword}
              onPress={() => setHideConfirmNewPassword(!hideConfirmNewPassword)}
            />

            {isLoader ? (
              <Loader />
            ) : (
              <CustomButton
                buttonName="Save Changes"
                onpress={() => handleSubmit()}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
});
