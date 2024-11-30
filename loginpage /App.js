import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './logindata';
import { useEffect } from 'react';
import LoginForm from './loginform';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack=createStackNavigator();

export default function App() {

  return (
    <View style={styles.container}>
    <NavigationContainer>
       <Stack.Navigator initialRouteName="LoginForm">
        <Stack.Screen name="LoginForm" component={LoginForm} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
