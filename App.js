import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MainTabScreen from './src/screens/MainTabScreen';
import Apartment from './src/screens/Apartment';
import Residence from './src/screens/Residence';
import House from './src/screens/House';
import Room from './src/screens/Room';
import RoomDetails from './src/screens/RoomDetails';
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import VerifyPhoneNumber from './src/screens/VerifyPhoneNumber';
import SearchResults from './src/screens/SearchResults';
import Form from './src/screens/Form';
import ChangePassword from './src/screens/ChangePassword';
import EditProfile from './src/screens/EditProfile';
import BookedProperty from './src/screens/BookedProperty';
import UserProfile from './src/screens/UserProfile';
import PropertyDetails from './src/screens/PropertyDetails';
import EditPost from './src/screens/EditPost';
import {UserProvider, ActionProvider} from './src/components/UserContext';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
]);
const Stack = createStackNavigator();

const App = () => {
  StatusBar.setBackgroundColor('#F6897F');
  return (
    <UserProvider>
      <ActionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={MainTabScreen} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen
              name="VerifyPhoneNumber"
              component={VerifyPhoneNumber}
            />
            <Stack.Screen name="Apartment" component={Apartment} />
            <Stack.Screen name="Residence" component={Residence} />
            <Stack.Screen name="House" component={House} />
            <Stack.Screen name="Room" component={Room} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
            <Stack.Screen name="BookedProperty" component={BookedProperty} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="RoomDetails" component={RoomDetails} />
            <Stack.Screen name="Form" component={Form} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="EditPost" component={EditPost} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
          </Stack.Navigator>
        </NavigationContainer>
      </ActionProvider>
    </UserProvider>
  );
};

export default App;
