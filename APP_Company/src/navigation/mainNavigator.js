// In App.js in a new project
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/Home';
import Settings from '../pages/Settings/Settings';
import ProfileTabNavigator from './profileTabNavigator';
import ListEvents from '../pages/Events/ListEvents';
import AddEvent from '../pages/Events/AddEvent';
import EventTabNavigator from './eventTabNavigator';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="Settings" component={Settings} options={{headerShown: true, title:"Configurações"}}/>
      <Stack.Screen name="ListEvents" component={ListEvents} options={{headerShown: true, title:"Eventos"}}/>
      <Stack.Screen name="AddEvent" component={AddEvent} options={{headerShown: true, title:"Adicionar"}}/>
      <Stack.Screen name="ProfileTabNavigator" component={ProfileTabNavigator} options={{headerShown: true, title:""}}/>
      <Stack.Screen name="EventTabNavigator" component={EventTabNavigator} options={{headerShown: true, title:""}}/>
    </Stack.Navigator>
  );
}
