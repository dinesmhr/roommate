import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ExploreScreen from './ExploreScreen';
import SavedScreen from './SavedScreen';
import MyRoomScreen from './MyRoomScreen';
import NotificationScreen from './NotificationScreen';
import LogIn from './LogIn';
import Profile from './Profile';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: 'white',
        inactiveBackgroundColor: 'white',
        activeTintColor: '#F6897F',
        inactiveTintColor: 'black',
        adaptive: false,
        style: {
          backgroundColor: 'white',
          height: hp('8%'),
        },
        tabStyle: {
          paddingVertical: hp('1%'),
        },
        labelStyle: {
          fontFamily: 'Segoe UI',
          fontSize: wp('4%'),
        },
        labelPosition: 'below-icon',
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: ({focused}) =>
            focused ? <Text style={styles.label}>Home</Text> : null,
          tabBarColor: 'white',
          tabBarIcon: ({focused}) => (
            <Feather
              name="search"
              color={focused ? '#F6897F' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarColor: 'white',
          tabBarLabel: ({focused}) =>
            focused ? <Text style={styles.label}>Saved</Text> : null,
          tabBarIcon: ({focused}) => (
            <Feather
              name="heart"
              color={focused ? '#F6897F' : 'black'}
              size={wp('6%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyRoom"
        component={MyRoomScreen}
        options={{
          tabBarColor: 'white',
          tabBarLabel: ({focused}) =>
            focused ? <Text style={styles.label}>My Rooms</Text> : null,
          tabBarIcon: ({focused}) => (
            <Feather
              name="message-square"
              color={focused ? '#F6897F' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarColor: 'white',
          tabBarLabel: ({focused}) =>
            focused ? <Text style={styles.label}>Notifications</Text> : null,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="notifications-outline"
              color={focused ? '#F6897F' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
      {user ? (
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarColor: 'white',
            tabBarLabel: ({focused}) =>
              focused ? <Text style={styles.label}>Profile</Text> : null,
            tabBarIcon: ({focused}) => (
              <Feather
                name="user"
                color={focused ? '#F6897F' : 'black'}
                size={wp('6.5%')}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="LogIn"
          component={LogIn}
          options={{
            tabBarColor: 'white',
            tabBarLabel: ({focused}) =>
              focused ? <Text style={styles.label}>Log In</Text> : null,
            tabBarIcon: ({focused}) => (
              <Feather
                name="user"
                color={focused ? '#F6897F' : 'black'}
                size={wp('6.5%')}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Segoe UI',
    fontSize: wp('3.5%'),
    color: '#F6897F',
  },
});
