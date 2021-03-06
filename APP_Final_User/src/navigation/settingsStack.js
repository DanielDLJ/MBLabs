// In App.js in a new project
import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Settings from '../pages/Settings/Settings';
import ProfileTabNavigator from './profileTabNavigator';
const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileTabNavigator"
        component={ProfileTabNavigator}
        options={{headerShown: true, title: ''}}
      />
    </Stack.Navigator>
  );
}
