// In App.js in a new project
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Settings from '../pages/Settings/Settings';
import ProfileTabNavigator from './profileTabNavigator';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
      <Stack.Screen name="ProfileTabNavigator" component={ProfileTabNavigator} options={{headerShown: true, title:""}}/>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}
