import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import RoomDescription from './RoomDescription';
import ImageSlider from 'react-native-image-slider';
import images from '../../constants/images';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PropertyDescription = ({
  imageUrl,
  title,
  location,
  rate,
  numberOfRooms,
  numberOfBedrooms,
  numberOfRoommates,
  type,
  features,
  description,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <ImageSlider images={imageUrl} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={{alignItems: 'center'}}>
          <Feather name="map-pin" size={wp('4%')} color="#F6897F" />
          <Text
            style={[
              styles.headingDescription,
              {fontFamily: 'AvantGardeDemiBT', color: 'black'},
            ]}>
            {' '}
            {location}
          </Text>
        </Text>

        <View style={[styles.headingContainer, {alignItems: 'flex-end'}]}>
          <Text style={styles.headingDescription}> NPR. {rate}/month</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Details</Text>
          </View>

          <RoomDescription
            description={numberOfRooms}
            info="rooms"
            src={images.rooms}
          />
          <RoomDescription
            description={numberOfBedrooms}
            info="beds"
            src={images.bed}
          />
          <RoomDescription
            description={numberOfRoommates}
            src={images.roommate}
            info="roommates"
          />
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Type</Text>
          </View>

          <RoomDescription description={type} src={images.home} />
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Features</Text>
          </View>

          <View style={styles.featureMainContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureContainer}>
                <Feather name="check-circle" size={wp('5%')} color="#F6897F" />
                <View style={styles.featureText}>
                  <Text style={styles.text}>{feature}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Description</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.text}>{description}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyDescription;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: hp('40%'),
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    justifyContent: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  descriptionContainer: {
    paddingBottom: hp('1.5%'),
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('6%'),
    paddingVertical: wp('1%'),
  },
  headingContainer: {
    paddingBottom: hp('1%'),
  },
  heading: {
    fontFamily: 'AvantGardeDemiBT',
    textTransform: 'capitalize',
    fontSize: wp('6%'),
    color: 'black',
  },
  details: {
    paddingLeft: wp('6%'),
  },
  featureText: {
    paddingLeft: wp('4%'),
  },
  headingDescription: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: '#F6897F',
  },
  text: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
