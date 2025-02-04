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
  const [receivedData, setReceivedData] = useState('');
  const [dataSubscription, setDataSubscription] = useState(null);

  useEffect(() => {
    checkBluetoothStatus();
    requestBluetoothPermissions();

    const onBluetoothEnabled = RNBluetoothClassic.onBluetoothEnabled(() => setBluetoothEnabled(true));
    const onBluetoothDisabled = RNBluetoothClassic.onBluetoothDisabled(() => setBluetoothEnabled(false));

    return () => {
      onBluetoothEnabled.remove();
      onBluetoothDisabled.remove();
      removeDataListener();
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
      setConnectedDevice(device);
      setDeviceName(device.name);
      ToastAndroid.show(`Conectado ao dispositivo ${device.name}`, ToastAndroid.SHORT);
      addDataListener(device);
    } catch (err) {
      console.error('Erro ao conectar ao dispositivo:', err);
      ToastAndroid.show('Erro ao conectar ao dispositivo', ToastAndroid.SHORT);
    }
  };

  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await RNBluetoothClassic.disconnectFromDevice(connectedDevice.address);
        setConnectedDevice(null);
        setDeviceName('Nenhum');
        ToastAndroid.show('Desconectado com sucesso', ToastAndroid.SHORT);
        removeDataListener();
      }
    } catch (err) {
      console.error('Erro ao desconectar do dispositivo:', err);
      ToastAndroid.show('Erro ao desconectar do dispositivo', ToastAndroid.SHORT);
    }
  };

  const sendCommand = async (command) => {
    try {
      if (connectedDevice) {
        const success = await connectedDevice.write(command, 'utf-8');
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

  const addDataListener = (device) => {
    const subscription = device.onDataReceived((event) => {
      console.log('Dados recebidos:', event.data);
      setReceivedData((prevData) => prevData + event.data);
    });
    setDataSubscription(subscription);
  };

  const removeDataListener = () => {
    if (dataSubscription) {
      dataSubscription.remove();
      setDataSubscription(null);
    }
  };

  const readData = async () => {
    try {
      if (connectedDevice) {
        const message = await connectedDevice.read();
        console.log('Mensagem recebida:', message.data);
        setReceivedData((prevData) => prevData + message.data);
      }
    } catch (err) {
      console.error('Erro ao ler dados:', err);
    }
  };

  const cancelDiscovery = async () => {
    try {
      await RNBluetoothClassic.cancelDiscovery();
      ToastAndroid.show('Descoberta de dispositivos cancelada', ToastAndroid.SHORT);
    } catch (err) {
      console.error('Erro ao cancelar descoberta:', err);
      ToastAndroid.show('Erro ao cancelar descoberta', ToastAndroid.SHORT);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
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
        receivedData,
        readData,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
