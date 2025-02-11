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
        ToastAndroid.showWithGravityAndOffset(
          'Por favor, ative o Bluetooth',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        );
      }
    } catch (err) {
      console.error('Bluetooth error:', err);
      ToastAndroid.showWithGravityAndOffset(
        'Erro ao verificar Bluetooth',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      );
    }
  };

  const startDiscovery = async () => {
    if (!bluetoothEnabled) {
      ToastAndroid.showWithGravityAndOffset(
        'Bluetooth não está habilitado',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      );
      return;
    }

    try {
      setDiscovering(true);
      const devices = await RNBluetoothClassic.startDiscovery();
      if (devices.length === 0) {;
        ToastAndroid.showWithGravityAndOffset(
          'Nenhum dispositivo encontrado',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        );
      } else {
        setDiscoveredDevices(devices);
        ToastAndroid.showWithGravityAndOffset(
          `Encontrado ${devices.length} dispositivos`,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        );     
      }
    } catch (err) {
      console.error('Erro ao descobrir dispositivos:', err);
      ToastAndroid.showWithGravityAndOffset(
        'Erro ao descobrir dispositivos',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
    } finally {
      setDiscovering(false);
    }
  };

  const connectToDevice = async (deviceAddress) => {
    try {
      const device = await RNBluetoothClassic.connectToDevice(deviceAddress);
      setConnectedDevice(device);
      setDeviceName(device.name);
      ToastAndroid.showWithGravityAndOffset(
        `Conectado ao dispositivo ${device.name}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
      addDataListener(device);
    } catch (err) {
      console.error('Erro ao conectar ao dispositivo:', err);
      ToastAndroid.showWithGravityAndOffset(
        'Erro ao conectar ao dispositivo',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
    }
  };

  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await RNBluetoothClassic.disconnectFromDevice(connectedDevice.address);
        setConnectedDevice(null);
        setDeviceName('Nenhum');
        ToastAndroid.showWithGravityAndOffset(
          'Desconectado com sucesso',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        )
        removeDataListener();
      }
    } catch (err) {
      console.error('Erro ao desconectar do dispositivo:', err);
      ToastAndroid.showWithGravityAndOffset(
        'Erro ao desconectar do dispositivo',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
    }
  };

  const sendCommand = async (command) => {
    setReceivedData('');  // Certifique-se de redefinir o estado após o processamento
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
      // Limpar a variável 'receivedData' para evitar concatenação
    });
    setDataSubscription(subscription);
  };

  const removeDataListener = () => {
    if (dataSubscription) {
      dataSubscription.remove();
      setDataSubscription(null);
    }
  };

  const cancelDiscovery = async () => {
    try {
      await RNBluetoothClassic.cancelDiscovery();
      ToastAndroid.showWithGravityAndOffset(
        'Pesquisa de dispositivos cancelada',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
    } catch (err) {
      console.error('Erro ao cancelar descoberta:', err);
      ToastAndroid.showWithGravityAndOffset(
        'Erro ao cancelar pesquisa',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      )
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
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
