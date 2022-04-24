import React, {useState, useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import FrontDetail from '../postCard/FrontDetail';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import PostTrigger from '../PostTrigger';
import {UserContext} from '../UserContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CardWithoutUser = ({
  onPostDetailPress,
  postId,
  navigation,
  postDetails,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const currentUser = useContext(UserContext);

  function onDropdownClose() {
    setOpenDropdown(false);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        {currentUser && postDetails.postOwnerId == currentUser.uid && (
          <View style={styles.editDeleteButton}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setOpenDropdown(!openDropdown)}>
              <Feather name="more-vertical" size={26} color="black" />
            </TouchableOpacity>
            {openDropdown && (
              <PostTrigger
                postId={postId}
                postDetails={postDetails}
                navigation={navigation}
                onDropdownClose={onDropdownClose}
              />
            )}
          </View>
        )}

        <FrontDetail
          imageSource={postDetails.images[0]}
          title={postDetails.title}
          price={postDetails.rate}
          location={postDetails.location}
          onPostDetailPress={onPostDetailPress}
        />
        <View style={styles.time}>
          {postDetails.timestamp && (
            <Text style={styles.timeText}>
              {moment(postDetails.timestamp.toDate()).format('llll')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CardWithoutUser;

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
  editDeleteButton: {
    alignItems: 'flex-end',
    // paddingRight: wp('2%'),
  },
  time: {
    alignItems: 'flex-end',
    paddingRight: wp('2%'),
  },
  timeText: {
    fontFamily: 'Segoe UI',
    fontSize: wp('4%'),
    color: 'black',
  },
});
