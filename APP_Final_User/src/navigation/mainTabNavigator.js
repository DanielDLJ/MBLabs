import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeStack from './homeStack';
import SettingsStack from './settingsStack';
import MyEventsStack from './myEventsStack';
import ProfilePassword from '../pages/Profile/ProfilePassword';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({tintColor}) => (
            <MaterialCommunityIcons name="home" size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="MyEventsTab"
        component={MyEventsStack}
        options={{
          title: 'Meus Ingressos',
          tabBarIcon: ({tintColor}) => (
            <MaterialCommunityIcons name="ticket" size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={SettingsStack}
        options={{
          title: 'Perfil',
          tabBarIcon: ({tintColor}) => (
            <Ionicons name="person" size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
