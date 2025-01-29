// src/BluetoothContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { PermissionsAndroid, Platform } from 'react-native';

const BluetoothContext = createContext();

export const useBluetooth = () => useContext(BluetoothContext);

export const BluetoothProvider = ({ children }) => {
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [discovering, setDiscovering] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

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
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      setBluetoothAvailable(available);
      setBluetoothEnabled(enabled);

      if (!enabled) {
        console.warn('Por favor, ative o Bluetooth');
      }
    } catch (err) {
      console.error('Erro ao verificar Bluetooth:', err);
    }
  };

  const startDiscovery = async () => {
    if (!bluetoothEnabled) {
      console.warn('Bluetooth não está habilitado');
      return;
    }

    try {
      setDiscovering(true);
      const devices = await RNBluetoothClassic.startDiscovery();
      setDiscoveredDevices(devices);
    } catch (err) {
      console.error('Erro ao descobrir dispositivos:', err);
    } finally {
      setDiscovering(false);
    }
  };

  const connectToDevice = async (deviceAddress) => {
    try {
      const device = await RNBluetoothClassic.connectToDevice(deviceAddress);
      setConnectedDevice(device);
    } catch (err) {
      console.error('Erro ao conectar ao dispositivo:', err);
    }
  };
  const sendCommand = async (command) => {
    try {
      if (connectedDevice) {
        // Usando writeToDevice() para enviar o comando
        const success = await RNBluetoothClassic.writeToDevice(connectedDevice.address, command);
        
        if (success) {
          console.log('Comando "${command}" enviado com sucesso');
        } else {
          console.log('Erro ao enviar comando: ${command}');
        }
      }
    } catch (err) {
      console.error('Erro ao enviar comando:', err);
    }
  };

  return (
    <BluetoothContext.Provider value={{
      bluetoothAvailable,
      bluetoothEnabled,
      discoveredDevices,
      discovering,
      connectedDevice,
      startDiscovery,
      connectToDevice,
      sendCommand,
    }}>
      {children}
    </BluetoothContext.Provider>
  );
};

