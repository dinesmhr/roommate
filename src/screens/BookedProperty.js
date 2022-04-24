import React, {useState, useEffect, useContext} from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import UserPostCard from '../components/cards/UserPostCard';
import HeaderButton from '../components/buttons/HeaderButton';
import Loading from '../components/loaders/Loading';
import {UserContext} from '../components/UserContext';
import style from '../css/styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BookedProperty = ({navigation, route}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    var unsubscribe = firestore()
      .collection('bookings')
      .where('bookerId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
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

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const Booked = () => {
    if (isLoading) {
      return <Loading />;
    } else if (posts.length < 1) {
      return (
        <View style={[style.noPosts, {paddingTop: hp('40%')}]}>
          <Text style={style.normalText}>
            You have not booked any property yet.
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          {posts.map(({id, post}) => (
            <UserPostCard
              key={id}
              postId={id}
              postDetails={post}
              navigation={navigation}
              onPostDetailPress={() =>
                navigation.navigate('RoomDetails', {postId: post.postId})
              }
            />
          ))}
        </View>
      );
    }
  };

  return (
    <View style={style.mainContainer}>
      <HeaderButton
        onPress={() => navigation.goBack()}
        titleText="Booked Property"
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
        <View style={style.typeContainer}>
          <Booked />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookedProperty;
