// In App.js in a new project
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import MainTabNavigator from './mainTabNavigator';
import ViewEvent from '../pages/Events/ViewEvent';
import BuyEvent from '../pages/Events/BuyEvent';
const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>

      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown: true}}/>
      <Stack.Screen name="ViewEvent" component={ViewEvent} options={{headerShown: true, title:""}}/>
      <Stack.Screen name="BuyEvent" component={BuyEvent} options={{headerShown: true, title:"Comprar"}}/>
    </Stack.Navigator>
  );
}
