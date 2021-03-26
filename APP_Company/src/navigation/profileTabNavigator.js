import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Profile from '../pages/Profile/Profile';
import ProfilePassword from '../pages/Profile/ProfilePassword';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} options={{title:"Perfil"}} />
      <Tab.Screen name="ProfilePassword" component={ProfilePassword} options={{title:"Nova Senha"}}/>
    </Tab.Navigator>
  );
}