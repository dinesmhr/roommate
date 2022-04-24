import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import * as geofire from 'geofire-common';
import UserPostCard from '../components/cards/UserPostCard';
import Loading from '../components/loaders/Loading';
import Feather from 'react-native-vector-icons/Feather';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import style from '../css/styles';

const API_KEY = 'AIzaSyAlP799yL7rMFBwpcRD3L6Q7iluAoStob0';

const SearchResults = ({route}) => {
  const queryText = route.params.queryText;
  const destinationLatitude = route.params.destinationLatitude;
  const destinationLongitude = route.params.destinationLongitude;

  const [location, setLocation] = useState(queryText);
  const [latitude, setLatitude] = useState(destinationLatitude);
  const [longitude, setLongitude] = useState(destinationLongitude);
  const [runQuery, setRunQuery] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const ref = useRef();

  useEffect(() => {
    getSearchResult();
  }, [runQuery]);

  useEffect(() => {
    ref.current?.setAddressText(location);
  }, []);

  const eraseSearchText = () => {
    ref.current?.clear();
  };

  const getSearchResult = () => {
    setIsLoading(true);
    const center = [latitude, longitude];
    const radiusInM = 20 * 1000;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
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

    // Collect all the query results together into a single list
    Promise.all(promises)
      .then(snapshots => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get('latitude');
            const lng = doc.get('longitude');

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
        // Process the matching documents
        setPosts(
          matchingDocs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          })),
        );
        setIsLoading(false);
      });
  };

  const MyApart = () => {
    if (isLoading) {
      return <Loading />;
    } else if (posts.length < 1) {
      return (
        <View style={styles.noSearchResult}>
          <Text style={style.normalText}>No results found.</Text>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={style.typeContainer}>
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Search by Location"
            textInputProps={{placeholderTextColor: '#707070'}}
            renderLeftButton={() => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" color="black" size={wp('7%')} />
              </TouchableOpacity>
            )}
            renderRightButton={() => (
              <TouchableOpacity onPress={() => eraseSearchText()}>
                <Feather name="x" color="black" size={wp('5%')} />
              </TouchableOpacity>
            )}
            suppressDefaultStyles={true}
            styles={{
              container: {
                flex: 1,
              },
              textInputContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: wp('2%'),
                width: wp('90%'),
                height: hp('6.5%'),
                borderRadius: wp('10%'),
                elevation: 2,
                backgroundColor: 'white',
              },
              textInput: {
                color: 'black',
                fontFamily: 'Segoe UI',
                backgroundColor: 'white',
                paddingHorizontal: wp('2%'),
                width: wp('72%'),

                borderRadius: wp('5%'),
                fontSize: wp('5%'),
              },
              listView: {
                width: wp('90%'),
                position: 'absolute',
                zIndex: 100,
                marginTop: hp('7.5%'),
                borderRadius: wp('4%'),
                elevation: 2,

                backgroundColor: 'white',
              },
              row: {
                // backgroundColor: 'white',
                borderRadius: wp('4%'),
                padding: wp('3%'),
              },
              poweredContainer: {
                display: 'none',
              },
              description: {
                color: 'black',
                fontFamily: 'Segoe UI',
                fontSize: wp('4.5%'),
              },
            }}
            fetchDetails={true}
            onPress={(data, details) => {
              // 'details' is provided when fetchDetails = true
              setLocation(data.description);
              setLatitude(details.geometry.location.lat);
              setLongitude(details.geometry.location.lng);
              setRunQuery(!runQuery);
            }}
            query={{
              key: API_KEY,
              language: 'en',
            }}
          />

          <View style={styles.searchResultsContainer}>
            <MyApart />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  searchResultsContainer: {
    paddingTop: hp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSearchResult: {
    paddingTop: hp('34%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    borderRadius: wp('10%'),
    borderColor: '#707070',
    width: wp('90%'),
    height: hp('6.5%'),
  },
});
