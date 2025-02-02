// src/PainelScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity  } from 'react-native';
import { useBluetooth } from '../context/BluetoothContext';  // Importando o Contexto
import { useNavigation } from '@react-navigation/native';
import Card from '../components/CardTemp';  // Importando o Componente Card
import CardGeneric from '../components/CardGeneric';  // Importando o Componente Card
import Vento from '../assets/image/vento.png'
import Orientacao from '../assets/image/orientacao.png'
import Temperatura from '../assets/image/temperatura.png'
import Medidor from '../assets/image/medidor.png'
import Umidade from '../assets/image/umidade.png'
import BluetoothIcon from '../assets/image/bluetooth.png'
import Atualizar from '../assets/image/atualizar.png'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'rgba(149, 148, 255, 0.925)'
  },
  viewConectar:{
    display:'flex',
    justifyContent:'center',
    alignItems:'flex-end',
    width:'100%',
    padding:20
  },
  button: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    padding: 5,
    borderWidth:2,
    borderColor:'rgb(96, 94, 255)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#ffffff',
    width:150
  },
  txtBtn:{
    fontSize: 18,
    fontFamily:"Nunito-ExtraBold",
    marginRight:10,
    color:'rgb(96, 94, 255)'
  },
  iconBtn:{
    width:30,
    height:30
  },
  text: {
    fontSize: 20,
    fontFamily:"Nunito-ExtraBold",
    marginBottom: 16,
    color:'#ffffff'
    
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
    flexDirection:'row',
    flex:2,
    width:'100%',
    justifyContent:'space-around',
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
  },
  img:{
    width:40,
    height:40
  },
  viewAtualizar:{
    marginTop:50
  }
});


export default function PainelScreen() {
  const { device, connectToDevice, sendCommand, connectedDevice, deviceName } = useBluetooth();
  const navigation = useNavigation();

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
      <View style={styles.viewConectar}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bluetooth')}>
          <Text style={styles.txtBtn}>Conectar</Text><Image style={styles.iconBtn} source={BluetoothIcon} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.text}>Dispositivo Conectado: {connectedDevice ? deviceName : 'Nenhum'}</Text>
      <View style={styles.divCards}>
        <Card
          title="Temperatura"
          content="25°C"
          image={Temperatura}
          style={styles.card}
        />
        <View style={styles.viewCard}>
          <View style={styles.viewHeader}>
            <Text style={styles.txtHeader}>Vento</Text>
          </View>
          <View style={styles.viewBody}>
            <Image style={styles.img} source={Vento}/>
            <Text style={styles.txtBody}>5 Km/h</Text>
          </View>
          <View style={styles.viewBody}>
            <Image style={styles.img} source={Orientacao}/>
            <Text style={styles.txtBody}>NE</Text>
          </View>
        </View>
      </View>
      <View style={styles.divCards}>
        <CardGeneric
          title="Umidade"
          content="68%"
          image={Umidade}
          style={styles.CardGeneric}
        />
        <CardGeneric
          title="Pressão"
          content="9810 hPa"
          image={Medidor}
          style={styles.CardGeneric}
        />
      </View>
      <View style={styles.viewAtualizar}>
        <TouchableOpacity style={styles.button} onPress={() => handleSendCommand('1')}>
            <Text style={styles.txtBtn}>Atualizar</Text><Image style={styles.iconBtn} source={Atualizar} />
        </TouchableOpacity>
      </View>


    </View>
  );
}

