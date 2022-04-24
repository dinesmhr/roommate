import React, {useState, useEffect, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {RefreshControl, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FloatingButton from '../components/buttons/FloatingButton';
import firestore from '@react-native-firebase/firestore';
import TitleText from '../components/texts/TitleText';
import {UserContext} from '../components/UserContext';
import Loading from '../components/loaders/Loading';
import CardWithoutUser from '../components/cards/CardWithoutUser';
import style from '../css/styles';

const MyRoomScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const currentUser = useContext(UserContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('posts')
        .where('postOwnerId', '==', currentUser.uid)
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

  const MyRoom = () => {
    if (!currentUser) {
      return (
        <View style={style.login}>
          <Text>
            <Text style={style.normalText}>Please </Text>
            <Text
              onPress={() => navigation.navigate('LogIn')}
              style={[style.normalText, {color: '#F6897F'}]}>
              Login{' '}
            </Text>
            <Text style={style.normalText}>to view your posts.</Text>
          </Text>
        </View>
      );
    } else if (isLoading) {
      return <Loading />;
    } else if (posts.length < 1) {
      return (
        <View style={style.tabNavNoPostContainer}>
          <Text style={style.normalText}>
            You have not posted your posts yet.
          </Text>
          <Text style={style.normalText}>Click the add button to post.</Text>
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
          <TitleText titleText="My Room Screen" />
          <MyRoom />
        </View>
      </ScrollView>
      <FloatingButton onPress={() => navigation.navigate('Form')} />
    </View>
  );
};

export default MyRoomScreen;
