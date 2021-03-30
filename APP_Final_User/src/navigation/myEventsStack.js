// In App.js in a new project
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListEvents from '../pages/Events/ListEvents';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListEvents" component={ListEvents} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
