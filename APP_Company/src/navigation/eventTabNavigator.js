import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import EditEvent from '../pages/Events/EditEvent';
import ListEventUsers from '../pages/Events/ListEventUsers';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="EditEvent" component={EditEvent} options={{title:"Editar"}} />
      <Tab.Screen name="ListEventUsers" component={ListEventUsers} options={{title:"Pessoas"}}/>
    </Tab.Navigator>
  );
}