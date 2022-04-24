import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const style = StyleSheet.create({
  //external css for all
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  // type and booked property

  typeContainer: {
    padding: hp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosts: {
    paddingTop: hp('37.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalText: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },

  //form and edit post
  formContainer: {
    marginHorizontal: wp('4.5%'),
    marginVertical: hp('2%'),
    backgroundColor: 'white',
  },
  componentContainer: {
    marginBottom: hp('2%'),
  },
  headingContainer: {
    marginBottom: hp('1.5%'),
  },
  subHeading: {
    fontFamily: 'Segoe UI Bold',
    fontSize: wp('6%'),
    color: 'black',
  },
  textAreaContainer: {},
  textArea: {
    height: hp('10%'),
    borderColor: '#F6897F',
    borderWidth: 1,
    padding: wp('3%'),
    borderRadius: wp('4%'),
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
    color: 'black',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  uploadImage: {
    height: hp('14%'),
    width: hp('14%'),
    borderWidth: 1,
    borderColor: '#F6897F',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    height: hp('14%'),
    width: hp('14%'),
    marginLeft: wp('3%'),
    borderRadius: wp('5%'),
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  locationTextView: {
    paddingTop: hp('1.25%'),
  },
  imageDeleteContainer: {
    position: 'absolute',
    right: 0,
  },
  imageDeleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6897F',
    borderRadius: 50,
    height: wp('5.5%'),
    width: wp('5.5%'),
  },

  //Tab Navigator Screens
  tabNavScreenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('2%'),
  },
  login: {
    paddingTop: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
  },
  tabNavNoPostContainer: {
    paddingTop: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  //profile and user profile
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  userNameContainer: {
    paddingTop: wp('1%'),
    paddingBottom: wp('0.5%'),
  },
  userName: {
    color: 'black',
    fontSize: wp('8%'),
    fontFamily: 'AvantGardeDemiBT',
    textTransform: 'capitalize',
  },
  userDetailContainer: {
    paddingVertical: hp('1%'),
  },
  detailText: {
    fontSize: wp('5%'),
    fontFamily: 'Segoe UI',
    color: '#F6897F',
    textAlign: 'center',
  },

  //property details and room details
  touchableButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: hp('7%'),
    padding: wp('2%'),
    elevation: 0.5,
  },
});

export default style;
