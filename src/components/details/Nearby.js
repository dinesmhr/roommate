import React, {useState, useEffect, useContext} from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  AppState,
} from 'react-native';
import UserPostCard from '../cards/UserPostCard';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import * as geofire from 'geofire-common';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActionContext} from '../UserContext';
import ConfirmModal from '../alert/ConfirmModal';

const Nearby = ({navigation}) => {
  const {action} = useContext(ActionContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const radiusInM = 2 * 100000;
  const [appState, setAppState] = useState(null);
  const [checkAppStatus, setCheckAppStatus] = useState();
  const [openSettings, setOpenSettings] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);

  useEffect(() => {
    var subscribe = requestLocationPermission();
    return () => {
      subscribe;
    };
  }, [action, checkAppStatus]);

  const onAppStateChange = async nextAppState => {
    // cold start
    if (appState === null) {
      // do whatever you need on cold start
    }
    // come to foreground from background
    else if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // do whatever you need on resume

      if (openSettings) {
        setCheckAppStatus(!checkAppStatus);
        setOpenSettings(false);
      }
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);
    if (appState === null) {
      // The event is not triggered on cold start since the change has already taken place
      // therefore we need to call it manually.
      onAppStateChange(AppState.currentState);
    }
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [appState]);

  function onConfirmYes() {
    // setConfirmVisible(false);
    Linking.openSettings().then(() => setConfirmVisible(false));
    setOpenSettings(true);
  }

  function onConfirmNo() {
    setConfirmVisible(false);
    setLocationPermissionDenied(true);
    setIsLoading(false);
    setOpenSettings(true);
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        getOneTimeLocation();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setConfirmVisible(true);
        setConfirmMessage(
          'Please grant location permission manually or clear all app data',
        );
      } else {
        setLocationPermissionDenied(true);
        setIsLoading(false);
        setOpenSettings(true);
        // console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = position.coords.longitude;
        const currentLatitude = position.coords.latitude;
        const center = [currentLatitude, currentLongitude];
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
          const q = firestore()
            .collection('posts')
            .where('bookingApproved', '==', false)
            .orderBy('hash')
            .orderBy('timestamp', 'desc')
            .startAt(b[0])
            .endAt(b[1]);

          promises.push(q.get());
        }

        Promise.all(promises)
          .then(snapshots => {
            const matchingDocs = [];

            for (const snap of snapshots) {
              for (const doc of snap.docs) {
                const latitude = doc.get('latitude');
                const longitude = doc.get('longitude');

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = geofire.distanceBetween(
                  [latitude, longitude],
                  center,
                );
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                  matchingDocs.push(doc);
                }
              }
            }

            return matchingDocs;
          })
          .then(matchingDocs => {
            setPosts(
              matchingDocs.map(doc => ({
                id: doc.id,
                post: doc.data(),
              })),
            );
            setIsLoading(false);
          });
      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  return (
    <View style={styles.nearbyRoomContainer}>
      <ConfirmModal
        yesText="Ok"
        noText="Cancel"
        visible={confirmVisible}
        message={confirmMessage}
        onConfirmNo={onConfirmNo}
        onConfirmYes={onConfirmYes}
      />
      <Text style={styles.title}>Nearby Properties</Text>
      {(() => {
        if (isLoading) {
          return (
            <View style={{marginTop: hp('3%')}}>
              <ActivityIndicator size="large" color="#F6897F" />
            </View>
          );
        } else if (locationPermissionDenied) {
          return (
            <View style={[styles.noNearby, {paddingHorizontal: wp('3%')}]}>
              <Text style={styles.noNearbyText}>
                Please grant location permission to view nearby properties.
              </Text>
            </View>
          );
        } else {
          if (posts.length < 1) {
            return (
              <View style={styles.noNearby}>
                <Text style={styles.noNearbyText}>No nearby rooms yet.</Text>
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
        }
      })()}
    </View>
  );
};

export default Nearby;

const styles = StyleSheet.create({
  nearbyRoomContainer: {
    width: wp('90%'),
  },
  title: {
    fontSize: wp('7%'),
    fontFamily: 'AvantGardeDemiBT',
    paddingLeft: wp('2%'),
    color: 'black',
  },
  noNearby: {
    paddingTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNearbyText: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
