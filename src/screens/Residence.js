import React, {useState, useEffect} from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import UserPostCard from '../components/cards/UserPostCard';
import HeaderButton from '../components/buttons/HeaderButton';
import Loading from '../components/loaders/Loading';
import style from '../css/styles';

const Residence = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    var unsubscribe = firestore()
      .collection('posts')
      .where('type', '==', 'Residence')
      .where('bookingApproved', '==', false)
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

  const Residence = () => {
    if (isLoading) {
      return <Loading />;
    } else if (posts.length < 1) {
      return (
        <View style={style.noPosts}>
          <Text style={style.normalText}>No residences available.</Text>
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
      <HeaderButton
        onPress={() => navigation.goBack()}
        titleText="Residences"
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
          <Residence />
        </View>
      </ScrollView>
    </View>
  );
};

export default Residence;
