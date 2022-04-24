import React, {useEffect, useState, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {RefreshControl, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import UserPostCard from '../components/cards/UserPostCard';
import TitleText from '../components/texts/TitleText';
import {UserContext} from '../components/UserContext';
import Loading from '../components/loaders/Loading';
import style from '../css/styles';

const SavedScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('saved')
        .where('saverId', '==', currentUser.uid)
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
    }
    return () => {
      unsubscribe;
    };
  }, [isFocused]);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const MySaved = () => {
    if (!currentUser) {
      return (
        <View style={style.login}>
          <Text>
            <Text style={style.normalText}>Please </Text>

            <Text
              style={[style.normalText, {color: '#F6897F'}]}
              onPress={() => navigation.navigate('LogIn')}>
              Login{' '}
            </Text>

            <Text style={style.normalText}>to view saved posts.</Text>
          </Text>
        </View>
      );
    } else {
      if (isLoading) {
        return <Loading />;
      } else {
        if (posts.length < 1) {
          return (
            <View style={style.tabNavNoPostContainer}>
              <Text style={style.normalText}>No saved posts yet.</Text>
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
      }
    }
  };

  return (
    <View style={style.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="#F6897F"
          />
        }>
        <View style={style.tabNavScreenContainer}>
          <TitleText titleText="Saved" />
          <MySaved />
        </View>
      </ScrollView>
    </View>
  );
};

export default SavedScreen;
