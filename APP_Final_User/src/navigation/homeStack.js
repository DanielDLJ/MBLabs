// In App.js in a new project
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/Home';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
