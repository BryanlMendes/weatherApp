import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import { useBluetooth } from '../context/BluetoothContext';
import Procurar from '../assets/image/procurar.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(149, 148, 255, 0.925)'
  },
  title: {
    fontSize: 30,
    fontFamily: "Nunito-ExtraBold",
    marginTop: 16,
    marginBottom: 16,
    color: '#ffffff'
  },
  text: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    marginBottom: 16,
    color: '#ffffff'
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    borderWidth: 2,
    borderColor: 'rgb(96, 94, 255)',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    width: 150
  },
  txtBtn: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    marginRight: 10,
    color: 'rgb(96, 94, 255)'
  },
  iconBtn: {
    width: 30,
    height: 30
  },
  viewDevice: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    overflow: 'hidden'
  },
  txtList: {
    fontSize: 20,
    fontFamily: "Nunito-ExtraBold",
    marginTop: 16,
    color: '#ffffff'
  },
  txtDevice: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
    color: 'rgb(96, 94, 255)'
  },
  btnConectar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgb(96, 94, 255)',
    width: 150
  },
  txtBtnConectar: {
    fontSize: 18,
    fontFamily: "Nunito-ExtraBold",
    marginRight: 10,
    color: '#ffffff'
  },
});

const BluetoothScreen = () => {
  const {
    bluetoothEnabled,
    discoveredDevices,
    discovering,
    startDiscovery,
    cancelDiscovery,
    disconnectFromDevice,
    connectToDevice,
    connectedDevice,
  } = useBluetooth();

  const [connectingDevice, setConnectingDevice] = useState(null);

  const handleConnect = async (deviceAddress) => {
    setConnectingDevice(deviceAddress);
    try {
      await connectToDevice(deviceAddress);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    } finally {
      setConnectingDevice(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexão Bluetooth</Text>
      <Text style={styles.text}>
        Bluetooth Habilitado: {bluetoothEnabled ? 'Sim' : 'Não'}
      </Text>

      {connectedDevice ? (
        <>
          <Text style={styles.text}>Conectado a: {connectedDevice.name}</Text>
          <TouchableOpacity 
            style={styles.button}                 
            onPress={disconnectFromDevice}
          >
            <Text style={styles.txtBtn}>Desconectar</Text>
          </TouchableOpacity>
        </>
      ) : (
        bluetoothEnabled && (
          <>
            {!discovering && (
              <TouchableOpacity 
                style={styles.button}                 
                onPress={startDiscovery}
              >
                <Text style={styles.txtBtn}>Pesquisar</Text>
                <Image style={styles.iconBtn} source={Procurar} />
              </TouchableOpacity>
            )}

            {discovering && (
              <>
                <TouchableOpacity 
                  style={styles.button}                 
                  onPress={cancelDiscovery}
                >
                  <Text style={styles.txtBtn}>Cancelar</Text>
                  <Image style={styles.iconBtn} source={Procurar} />
                </TouchableOpacity>
                <Text style={styles.text}>Procurando dispositivos...</Text>
              </>
            )}

            <View>
              {discoveredDevices.length > 0 && <Text style={styles.txtList}>Dispositivos Encontrados:</Text>}
              {discoveredDevices.map((device) => (
                <View style={styles.viewDevice} key={device.address}>
                  <Text style={styles.txtDevice}>{device.name}</Text>
                  <TouchableOpacity 
                    style={styles.btnConectar}
                    onPress={() => handleConnect(device.address)}
                    disabled={connectingDevice === device.address}
                  >
                    <Text style={styles.txtBtnConectar}>
                      {connectingDevice === device.address ? "Conectando..." : "Conectar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )
      )}
    </View>
  );
};



export default BluetoothScreen;
