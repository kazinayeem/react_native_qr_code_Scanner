/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screen/Home';
import SettingsScreen from './screen/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScanScreen from './screen/QrCode';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: true,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'QrCode') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          options={{
            title: 'HOME',
          }}
          component={HomeScreen}
        />

        <Tab.Screen
          name="QrCode"
          options={{
            headerShown: false,
            title: 'SCAN QR',
          }}
          component={ScanScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
