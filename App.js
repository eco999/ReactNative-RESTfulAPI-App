import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/login';
import UserScreen from './components/user'

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="User" component={UserScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    )

  }
}

//<Button onPress={() => getData().then(thing => console.log(thing))} title="Test async"></Button>

export default App;