// src/BluetoothContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

const BluetoothContext = createContext();

export const useBluetooth = () => useContext(BluetoothContext);

export const BluetoothProvider = ({ children }) => {
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [discovering, setDiscovering] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('Nenhum');

  useEffect(() => {
    checkBluetoothStatus();
    requestBluetoothPermissions();

    const onBluetoothEnabled = RNBluetoothClassic.onBluetoothEnabled(() => setBluetoothEnabled(true));
    const onBluetoothDisabled = RNBluetoothClassic.onBluetoothDisabled(() => setBluetoothEnabled(false));

    return () => {
      onBluetoothEnabled.remove();
      onBluetoothDisabled.remove();
    };
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ...(Platform.Version >= 31
            ? [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              ]
            : []),
        ];
        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          console.warn('Permissões de Bluetooth negadas');
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissões:', err);
      }
    }
  };

  const checkBluetoothStatus = async () => {
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      setBluetoothAvailable(available);

      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setBluetoothEnabled(enabled);

      if (!enabled) {
        ToastAndroid.show('Por favor, ative o Bluetooth', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error('Bluetooth error:', err);
      ToastAndroid.show('Erro ao verificar Bluetooth', ToastAndroid.SHORT);
    }
  };

  const handleBluetoothEnabled = () => {
    setBluetoothEnabled(true);
  };

  const handleBluetoothDisabled = () => {
    setBluetoothEnabled(false);
  };

  const startDiscovery = async () => {
    if (!bluetoothEnabled) {
      ToastAndroid.show('Bluetooth não está habilitado', ToastAndroid.SHORT);
      return;
    }

    try {
      setDiscovering(true);
      const devices = await RNBluetoothClassic.startDiscovery();
      if (devices.length === 0) {
        ToastAndroid.show('Nenhum dispositivo encontrado', ToastAndroid.SHORT);
      } else {
        setDiscoveredDevices(devices);
        ToastAndroid.show(`Encontrado ${devices.length} dispositivos`, ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error('Erro ao descobrir dispositivos:', err);
      ToastAndroid.show('Erro ao descobrir dispositivos', ToastAndroid.SHORT);
    } finally {
      setDiscovering(false);
    }
  };

  const connectToDevice = async (deviceAddress) => {
    try {
      const device = await RNBluetoothClassic.connectToDevice(deviceAddress);
      setConnectedDevice(device); // Armazena o dispositivo conectado
      ToastAndroid.show(`Conectado ao dispositivo ${device.name}`, ToastAndroid.SHORT);
      setDeviceName(device.name)
    } catch (err) {
      console.error('Erro ao conectar ao dispositivo:', err);
      ToastAndroid.show('Erro ao conectar ao dispositivo', ToastAndroid.SHORT);
    }
  };

  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await RNBluetoothClassic.disconnectFromDevice(connectedDevice.address);
        setConnectedDevice(null); // Limpa o estado do dispositivo conectado
        setDeviceName('Nenhum')
        ToastAndroid.show('Desconectado com sucesso', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error('Erro ao desconectar do dispositivo:', err);
      ToastAndroid.show('Erro ao desconectar do dispositivo', ToastAndroid.SHORT);
    }
  };

  const sendCommand = async (command) => {
    try {
      if (connectedDevice) {
        // Usando writeToDevice() para enviar o comando
        const success = await RNBluetoothClassic.writeToDevice(connectedDevice.address, command);
        
        if (success) {
          console.log(`Comando "${command}" enviado com sucesso`);
        } else {
          console.log(`Erro ao enviar comando: ${command}`);
        }
      }
    } catch (err) {
      console.error('Erro ao enviar comando:', err);
    }
  };

  const cancelDiscovery = async () => {
    try {
      const result = await RNBluetoothClassic.cancelDiscovery();
      ToastAndroid.show('Descoberta de dispositivos cancelada', ToastAndroid.SHORT);
    } catch (err) {
      console.error('Erro ao cancelar descoberta:', err);
      ToastAndroid.show('Erro ao cancelar descoberta', ToastAndroid.SHORT);
    }
  };

  return (
    <BluetoothContext.Provider value={{
      bluetoothAvailable,
      bluetoothEnabled,
      discoveredDevices,
      discovering,
      connectedDevice,
      deviceName,
      cancelDiscovery,
      disconnectFromDevice,
      startDiscovery,
      connectToDevice,
      sendCommand,
    }}>
      {children}
    </BluetoothContext.Provider>
  );
};

