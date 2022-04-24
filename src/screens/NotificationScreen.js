import React, {useState, useContext, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {UserContext} from '../components/UserContext';
import firestore from '@react-native-firebase/firestore';
import NotificationCard from '../components/cards/NotificationCard';
import Loading from '../components/loaders/Loading';
import TitleText from '../components/texts/TitleText';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';

const NotificationScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const currentUser = useContext(UserContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    var unsubscribe;
    if (currentUser) {
      unsubscribe = firestore()
        .collection('notifications')
        .where('toUserId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          setNotifications(
            snapshot.docs.map(doc => ({
              id: doc.id,
              notification: doc.data(),
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

  const MyNotification = () => {
    if (!currentUser) {
      return (
        <View style={[style.login, {paddingTop: hp('38%')}]}>
          <Text>
            <Text style={style.normalText}>Please </Text>
            <Text
              onPress={() => navigation.navigate('LogIn')}
              style={[style.normalText, {color: '#F6897F'}]}>
              Login{' '}
            </Text>
            <Text style={style.normalText}>to view your notifications.</Text>
          </Text>
        </View>
      );
    } else if (isLoading) {
      return <Loading />;
    } else if (notifications.length < 1) {
      return (
        <View style={[style.tabNavNoPostContainer, {paddingTop: hp('38%')}]}>
          <Text style={style.normalText}>No notifications to view.</Text>
        </View>
      );
    } else {
      return (
        <View>
          {notifications.map(({id, notification}) => (
            <NotificationCard
              key={id}
              timestamp={notification.timestamp}
              postId={notification.postId}
              postOwnerId={notification.postOwnerId}
              fromUserDocId={notification.fromUserDocId}
              fromUserId={notification.fromUserId}
              timestamp={notification.timestamp}
              navigation={navigation}
              message={notification.message}
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
          <TitleText titleText="Notifications" />

          <View style={styles.notifications}>
            <MyNotification />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  notifications: {
    paddingTop: hp('2%'),
  },
});
