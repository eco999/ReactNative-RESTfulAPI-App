import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/login';
import UserScreen from './components/user';
import FriendScreen from './components/friend'
import PostScreen from './components/post'

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="Friend" component={FriendScreen} />
          <Stack.Screen name="Post" component={PostScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    )

  }
}


export default App;