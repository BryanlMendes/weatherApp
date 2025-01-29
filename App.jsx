import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BluetoothProvider } from './context/BluetoothContext'; 

// Import screens from the 'screens' folder
import Home from './screens/HomeScreen';
import Bluetooth from './screens/BluetoothScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Bluetooth" component={Bluetooth} />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
};
