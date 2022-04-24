import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {UserContext} from '../components/UserContext';
import Loading from '../components/loaders/Loading';
import RNRestart from 'react-native-restart';
import ConfirmModal from '../components/alert/ConfirmModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const Profile = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const [userDocId, setUserDocId] = useState('');
  const [details, setDetails] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const ProfileButton = ({buttonName, onPress, icon}) => (
    <View style={styles.mainButtonContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.buttonContainer}>
          <View>
            <Feather name={icon} color="#F6897F" size={wp('6.5%')} />
          </View>
          <View style={{paddingLeft: wp('1.5%')}}>
            <Text style={style.normalText}>{buttonName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('users')
        .where('userId', '==', currentUser.uid)
        .onSnapshot(snapshot => {
          snapshot.docs.map(doc => {
            setUserDocId(doc.id);
            setDetails(doc.data());
          });
          setIsLoading(false);
        });
    }
    return () => {
      unsubscribe;
    };
  }, []);

  const handleLogOut = () => {
    setConfirmVisible(true);
    setConfirmMessage('Are you sure you want to log out?');
  };

  function onConfirmNo() {
    setConfirmVisible(false);
  }

  function onConfirmYes() {
    auth()
      .signOut()
      .then(() => RNRestart.Restart());
  }
  const UserDetail = ({detailText}) => (
    <View style={{paddingBottom: hp('0.5%')}}>
      <Text style={style.detailText}>{detailText}</Text>
    </View>
  );

  const RenderInfoBox = () => (
    <View style={styles.infoBoxWrapper}>
      <View
        style={[
          styles.infoBox,
          {
            borderRightColor: '#F6897F',
            borderRightWidth: 1,
          },
        ]}>
        <Text style={style.normalText}>{details.numberOfPosts}</Text>
        {details.numberOfPosts == 1 ? (
          <Text style={[style.normalText, {fontSize: wp('4%')}]}>Post</Text>
        ) : (
          <Text style={[style.normalText, {fontSize: wp('4%')}]}>Posts</Text>
        )}
      </View>
      <View style={styles.infoBox}>
        <Text style={style.normalText}>{details.numberOfBookings}</Text>
        {details.numberOfBookings == 1 ? (
          <Text style={[style.normalText, {fontSize: wp('4%')}]}>
            Property Booked
          </Text>
        ) : (
          <Text style={[style.normalText, {fontSize: wp('4%')}]}>
            Properties Booked
          </Text>
        )}
      </View>
    </View>
  );

  const RenderMenu = () => (
    <View style={styles.menu}>
      <ProfileButton
        buttonName="Booked Property"
        onPress={() =>
          navigation.navigate('BookedProperty', {userDocId: userDocId})
        }
        icon="home"
      />
      <ProfileButton
        buttonName="Change Password"
        onPress={() =>
          navigation.navigate('ChangePassword', {userDocId: userDocId})
        }
        icon="key"
      />
      {!details.phoneNumberVerified && (
        <ProfileButton
          buttonName="Verify Mobile Number"
          onPress={() =>
            navigation.navigate('VerifyPhoneNumber', {
              userDocId: userDocId,
            })
          }
          icon="phone"
        />
      )}
      <ProfileButton
        buttonName="Log Out"
        onPress={() => handleLogOut()}
        icon="log-out"
      />
    </View>
  );

  return (
    <View style={style.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ConfirmModal
          yesText="Yes"
          noText="No"
          visible={confirmVisible}
          message={confirmMessage}
          onConfirmNo={onConfirmNo}
          onConfirmYes={onConfirmYes}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.editIcon}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    userDocId: userDocId,
                    userName: details.name,
                    userLocation: details.location,
                    userPhoneNumber: details.phoneNumber,
                    userImage: details.userImage,
                  })
                }>
                <Feather name="edit" color="#F6897F" size={wp('8%')} />
              </TouchableOpacity>
            </View>

            <View style={style.avatar}>
              <Image
                style={{
                  height: wp('25%'),
                  width: wp('25%'),
                  borderRadius: wp('50%'),
                  borderWidth: 2,
                  borderColor: '#F6897F',
                }}
                source={{uri: details.userImage}}
              />
              <View style={style.userNameContainer}>
                <Text style={style.userName}>{details.name}</Text>
              </View>
              <View>
                <UserDetail detailText={details.location} />
                <UserDetail detailText={details.email} />
                <UserDetail detailText={details.phoneNumber} />
              </View>
            </View>
            <RenderInfoBox />
            <RenderMenu />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  editIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  infoBoxWrapper: {
    borderBottomColor: '#F6897F',
    borderBottomWidth: 1,
    borderTopColor: '#F6897F',
    flexDirection: 'row',
    borderTopWidth: 1,
    height: hp('10%'),
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    elevation: 0.5,
  },
  buttonContainer: {
    height: hp('6.5%'),
    width: wp('62%'),
    borderWidth: 2,
    borderColor: '#F6897F',
    borderRadius: wp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
});
