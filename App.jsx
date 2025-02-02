import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BluetoothProvider } from './context/BluetoothContext'; 

// Import screens from the 'screens' folder
import Painel from './screens/PainelScreen';
import Bluetooth from './screens/BluetoothScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Painel'
          screenOptions={{
            headerStyle: {
              height: 50, // Define a altura do header
              backgroundColor: '#6200ea', // Cor de fundo do header
            },
            headerTitleStyle: {
              fontSize: 24, // Tamanho da fonte
              fontFamily: 'Nunito-Bold', // Família da fonte (troque para a que deseja)
              color: '#ffffff', // Cor da fonte
            },
          }}
        >
          <Stack.Screen name="Painel" component={Painel} />
          <Stack.Screen name="Bluetooth" component={Bluetooth} />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
};
