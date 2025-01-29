import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [sendCommand, setSendCommand] = useState(null);
  const navigation = useNavigation();

  const handleSendCommand = (command) => {
    navigation.navigate('Bluetooth', { command }); // Enviando o parâmetro 'command'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen!</Text>
      <Button title="Acender LED" onPress={() => handleSendCommand('1')} />
      <Button title="Apagar LED" onPress={() => handleSendCommand('0')} />
      <Button
        title="Bluetooth"
        onPress={() => navigation.navigate('Bluetooth')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
