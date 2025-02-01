// src/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid } from 'react-native';
import { useBluetooth } from '../context/BluetoothContext';  // Importando o Contexto
import { useNavigation } from '@react-navigation/native';
import Card from '../components/CardTemp';  // Importando o Componente Card
import CardGeneric from '../components/CardGeneric';  // Importando o Componente Card

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
      <Button title="Conectar Bluetooth" onPress={() => navigation.navigate('Bluetooth')} />
      <Text style={styles.text}>Dispositivo Conectado: {connectedDevice ? deviceName : 'Nenhum'}</Text>
      <View style={styles.divCards}>
        <Card
          title="Temperatura"
          content="25°C"
          style={styles.card}
        />
        <View style={styles.viewCard}>
          <View style={styles.viewHeader}>
            <Text style={styles.txtHeader}>
              Vento
            </Text>
          </View>
          <View style={styles.viewBody}>
            <Text style={styles.txtBody}>
              5 Km/h
            </Text>
          </View>
          <View style={styles.viewBody}>
            <Text style={styles.txtBody}>
              NE
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.divCards}>
        <CardGeneric
          title="Umidade"
          content="68%"
          style={styles.CardGeneric}
        />
        <CardGeneric
          title="Pressão"
          content="9810 hPc"
          style={styles.CardGeneric}
        />
      </View>
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
    backgroundColor:'rgba(149, 148, 255, 0.925)'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    
  },
  card: {
    display:'flex',
    flex:1,
    height:150
  },
  CardGeneric:{
    display:'flex',
    flex:1,
    height:90
  },
  divCards:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  viewCard:{
    display:'flex',
    flex:1,
    height:150,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center', // Centraliza na horizontal
    overflow: 'hidden', // Impede que o conteúdo ultrapasse os limites
  },
  viewHeader:{
    display:'flex',
    flex:1,
    width:'100%',
    alignItems:'center',
  },
  viewBody:{
    display:'flex',
    flex:2,
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  txtHeader:{
    fontSize:22,
    fontFamily:"Nunito-Bold",
    color:'#ffffff'
  },
  txtBody:{
    fontSize:26,
    fontFamily:"Nunito-ExtraBold",
    color:'#ffffff'
  }
});
