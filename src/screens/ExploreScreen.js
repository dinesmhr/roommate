import React, {useState, useRef} from 'react';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ExploreCard from '../components/cards/ExploreCard';
import Feather from 'react-native-vector-icons/Feather';
import images from '../constants/images';
import Nearby from '../components/details/Nearby';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import style from '../css/styles';
// const API_KEY = 'AIzaSyAlP799yL7rMFBwpcRD3L6Q7iluAoStob0';

const API_KEY = 'AIzaSyBDlkEHKB7Xn258SuhPlmYPalipDhAx-gk';

const ExploreScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef();

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const onChangeSearch = query => setSearchQuery(query);
  const handleSubmit = () => {
    navigation.navigate('SearchResults', {queryText: searchQuery});
    wait(1000).then(() => setSearchQuery(''));
  };

  const eraseSearchText = () => {
    wait(1000).then(() => ref.current?.clear());
  };

  return (
    <View style={style.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="#F6897F"
          />
        }>
        <>
          <View style={styles.container}>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search by Location"
              textInputProps={{placeholderTextColor: '#707070'}}
              renderLeftButton={() => (
                <Feather name="search" color="black" size={wp('7%')} />
              )}
              suppressDefaultStyles={true}
              styles={{
                container: {
                  flex: 1,
                },
                textInputContainer: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: wp('2%'),
                  width: wp('87%'),
                  height: hp('6.5%'),
                  borderRadius: wp('10%'),
                  elevation: 2,
                  backgroundColor: 'white',
                },
                textInput: {
                  color: 'black',
                  fontFamily: 'Segoe UI',
                  backgroundColor: 'white',
                  paddingLeft: wp('2%'),
                  width: wp('76%'),
                  borderRadius: wp('5%'),
                  fontSize: wp('5%'),
                },
                listView: {
                  width: wp('87%'),
                  position: 'absolute',
                  zIndex: 100,
                  marginTop: hp('7.5%'),
                  borderRadius: wp('4%'),
                  elevation: 2,
                  backgroundColor: 'white',
                },
                row: {
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
                const destinationLatitude = details.geometry.location.lat;
                const destinationLongitude = details.geometry.location.lng;

                navigation.navigate('SearchResults', {
                  queryText: data.description,
                  destinationLatitude: destinationLatitude,
                  destinationLongitude: destinationLongitude,
                });
                eraseSearchText();
              }}
              query={{
                key: API_KEY,
                language: 'en',
              }}
            />

            <View style={styles.exploreContainer}>
              <Text style={styles.title}>Explore</Text>
              <View style={styles.explore}>
                <View style={styles.row}>
                  <ExploreCard
                    category="Apartment"
                    source={images.apartment}
                    onPress={() => navigation.navigate('Apartment')}
                  />
                  <ExploreCard
                    category="Residence"
                    source={images.residence}
                    onPress={() => navigation.navigate('Residence')}
                  />
                </View>
                <View style={styles.row}>
                  <ExploreCard
                    category="House"
                    source={images.house}
                    onPress={() => navigation.navigate('House')}
                  />
                  <ExploreCard
                    category="Room"
                    source={images.room}
                    onPress={() => navigation.navigate('Room')}
                  />
                </View>
              </View>
            </View>
            <Nearby navigation={navigation} />
          </View>
        </>
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2.5%'),
  },
  title: {
    fontSize: wp('7%'),
    paddingLeft: wp('2%'),
    fontFamily: 'AvantGardeDemiBT',
    color: 'black',
  },
  exploreContainer: {
    marginTop: hp('2%'),
    width: wp('90%'),
  },
  explore: {
    marginTop: hp('1.5%'),
  },
  row: {
    marginBottom: hp('2%'),
    marginHorizontal: wp('2%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
