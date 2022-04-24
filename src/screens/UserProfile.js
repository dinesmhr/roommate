import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import CardWithoutUser from '../components/cards/CardWithoutUser';
import HeaderButton from '../components/buttons/HeaderButton';
import Loading from '../components/loaders/Loading';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TitleText from '../components/texts/TitleText';
import style from '../css/styles';

const UserProfile = ({route, navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userDetails = route.params.userDetails;

  useEffect(() => {
    var unsubscribe = firestore()
      .collection('posts')
      .where('postOwnerId', '==', userDetails.userId)
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          })),
        );
        setIsLoading(false);
      });

    return () => {
      unsubscribe;
    };
  }, []);

  const UserDetail = ({detailText}) => (
    <View style={{paddingBottom: hp('0.8%')}}>
      <Text style={style.detailText}>{detailText}</Text>
    </View>
  );

  const UserPosts = () => {
    if (isLoading) {
      return <Loading />;
    } else if (posts.length < 1) {
      return (
        <View style={styles.noPosts}>
          <Text style={style.normalText}>
            No posts from {userDetails.name} yet.
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          {posts.map(({id, post}) => (
            <CardWithoutUser
              key={id}
              postId={id}
              postDetails={post}
              navigation={navigation}
              onPostDetailPress={() =>
                navigation.navigate('RoomDetails', {postId: id})
              }
            />
          ))}
        </View>
      );
    }
  };
  return (
    <View style={style.mainContainer}>
      <HeaderButton onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailsContainer}>
          <View style={style.avatar}>
            <Image
              style={{
                height: wp('25%'),
                width: wp('25%'),
                borderRadius: wp('50%'),
                borderWidth: 2,
                borderColor: '#F6897F',
              }}
              source={{uri: userDetails.userImage}}
            />
            <View style={style.userNameContainer}>
              <Text style={style.userName}>{userDetails.name}</Text>
            </View>
            <View>
              <UserDetail detailText={userDetails.location} />
              <UserDetail detailText={userDetails.email} />
            </View>
          </View>

          <View>
            <TitleText titleText="Posts" />
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <UserPosts />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  detailsContainer: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
  },
  noPosts: {
    paddingTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
