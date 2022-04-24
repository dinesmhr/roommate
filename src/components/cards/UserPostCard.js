import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FrontDetail from '../postCard/FrontDetail';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import PostTrigger from '../PostTrigger';
import {UserContext} from '../UserContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const UserPostCard = ({onPostDetailPress, postId, navigation, postDetails}) => {
  const [postOwnerDetails, setPostOwnerDetails] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const currentUser = useContext(UserContext);

  useEffect(() => {
    var unsubscribe;
    if (postDetails.postOwnerDocId) {
      unsubscribe = firestore()
        .collection('users')
        .doc(postDetails.postOwnerDocId)
        .onSnapshot(doc => {
          const data = doc.data();
          setPostOwnerDetails(data);
        });
    }
    return () => {
      unsubscribe;
    };
  }, [postDetails.postOwnerId]);

  function onDropdownClose() {
    setOpenDropdown(false);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('UserProfile', {
                userDetails: postOwnerDetails,
              })
            }>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Image
                  style={styles.image}
                  source={{uri: postOwnerDetails.userImage}}
                />
              </View>
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>{postOwnerDetails.name}</Text>
                {postDetails.timestamp && (
                  <Text style={styles.time}>
                    {moment(postDetails.timestamp.toDate()).format('llll')}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          {currentUser && postDetails.postOwnerId == currentUser.uid && (
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setOpenDropdown(!openDropdown)}>
                <Feather name="more-vertical" size={26} color="black" />
              </TouchableOpacity>
            </View>
          )}
          {openDropdown && (
            <PostTrigger
              postId={postId}
              postDetails={postDetails}
              navigation={navigation}
              onDropdownClose={onDropdownClose}
            />
          )}
        </View>

        <FrontDetail
          imageSource={postDetails.images[0]}
          title={postDetails.title}
          price={postDetails.rate}
          location={postDetails.location}
          onPostDetailPress={onPostDetailPress}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default UserPostCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  card: {
    borderRadius: wp('7%'),
    marginVertical: hp('1.5%'),
    padding: wp('3%', '2%'),
    backgroundColor: 'white',
    elevation: 5,
    width: wp('90%'),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: hp('1%'),
  },
  userNameContainer: {
    paddingLeft: wp('2%'),
    width: wp('60%'),
  },
  image: {
    height: wp('13%'),
    width: wp('13%'),
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  userName: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI Bold',
    color: 'black',
    textTransform: 'capitalize',
  },
  time: {
    fontFamily: 'Segoe UI',
    fontSize: wp('4%'),
    color: 'black',
  },
});
