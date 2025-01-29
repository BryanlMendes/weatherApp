// src/BluetoothScreen.js
import React, { useEffect } from 'react';
import { View, Text, Button, ToastAndroid } from 'react-native';
import { useBluetooth } from '../context/BluetoothContext';  // Importando o Contexto

const BluetoothScreen = () => {
  const {
    bluetoothAvailable,
    bluetoothEnabled,
    discoveredDevices,
    discovering,
    startDiscovery,
    cancelDiscovery,
    disconnectFromDevice,
    connectToDevice,
    connectedDevice,
  } = useBluetooth();

  useEffect(() => {
    // Aqui você pode chamar funções de inicialização ou monitoramento se necessário
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Bluetooth Disponível: {bluetoothAvailable ? 'Sim' : 'Não'}</Text>
          <Text>Bluetooth Habilitado: {bluetoothEnabled ? 'Sim' : 'Não'}</Text>
          {connectedDevice && (
            <>
              <Text>Conectado a: {connectedDevice.name}</Text>
              <Button title="Desconectar" onPress={disconnectFromDevice} />
            </>
          )}

          {!connectedDevice && (
            <>
              <Button
                title="Iniciar Descoberta"
                onPress={startDiscovery}
                disabled={discovering || !bluetoothEnabled}
              />
              {discovering && <Text>Descobrindo dispositivos...</Text>}
              <Button
                title="Cancelar Descoberta"
                onPress={cancelDiscovery}
                disabled={!discovering}
              />
              <View>
                {discoveredDevices.length > 0 && <Text>Dispositivos Descobertos:</Text>}
                {discoveredDevices.map((device) => (
                  <View key={device.address}>
                    <Text>{device.name}</Text>
                    <Button title="Conectar" onPress={() => connectToDevice(device.address)} />
                  </View>
                ))}
              </View>
            </>
          )}
    </View>
  );
};

export default BluetoothScreen;
