import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Loading = () => {
  return (
    <View style={{marginTop: hp('38%')}}>
      <ActivityIndicator size="large" color="#F6897F" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
