// src/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid } from 'react-native';
import { useBluetooth } from '../context/BluetoothContext';  // Importando o Contexto
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { device, connectToDevice, sendCommand, connectedDevice, deviceName } = useBluetooth();
    const navigation = useNavigation();

  const handleConnect = () => {
    connectToDevice('dispositivo_address_aqui');  // Passar o endereço do dispositivo
    ToastAndroid.show('Tentando conectar...', ToastAndroid.SHORT);
  };

  const handleSendCommand = (command) => {
    if(connectedDevice){
      if (sendCommand(command)) {
        ToastAndroid.show(`Comando "${command}" enviado!`, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Erro ao enviar comando', ToastAndroid.SHORT);
      }
    }else{
      ToastAndroid.show('Dispositivo desconectado!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dispositivo Conectado: {connectedDevice ? deviceName : 'Nenhum'}</Text>
      <Button title="Conectar Bluetooth" onPress={() => navigation.navigate('Bluetooth')} />
      <Button title="Acender LED" onPress={() => handleSendCommand('1')} />
      <Button title="Apagar LED" onPress={() => handleSendCommand('0')} />
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
