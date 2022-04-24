import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    elevation: 2,
  },
  loader: {
    height: hp('6.5%'),
    width: wp('62%'),
    backgroundColor: '#F6897F',
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
