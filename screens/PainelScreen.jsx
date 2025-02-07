// src/PainelScreen.js
import React, { useState, useEffect } from 'react';
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
import Bateria25 from '../assets/image/bateria25.png'
import Bateria50 from '../assets/image/bateria50.png'
import Bateria75 from '../assets/image/bateria75.png'
import Bateria100 from '../assets/image/bateria100.png'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'rgba(149, 148, 255, 0.925)'
  },
  viewConectar:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    padding:20
  },
  viewBateria:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  txtBateria:{
    fontSize: 20,
    fontFamily:"Nunito-ExtraBold",
    color:'#ffffff',
    marginLeft:5
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
    height:120
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
  viewOri:{
    display:'flex',
    flexDirection:'row',
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
  },
  txtOri:{
    fontSize:30,
    fontFamily:"Nunito-ExtraBold",
    color:'#ffffff',
    marginLeft:10
  },
  imgVento:{
    width:35,
    height:35
  },
  imgOri:{
    width:55,
    height:55,
    marginRight:10
  },
  viewAtualizar:{
    marginTop:50
  }
});


export default function PainelScreen() {
  const { device, connectToDevice, sendCommand, receivedData, connectedDevice, deviceName } = useBluetooth();
  const navigation = useNavigation();
  const [dados, setDados] = useState({
    temperatura: '-',
    pressao: '-',
    vento: '-',
    orientacao: '-',
    umidade: '-',
    bateria: '-'
  });


  // Atualiza os dados quando `receivedData` muda 
  useEffect(() => {
    if (receivedData) {

      console.log('Dados recebidos pela outra tela:', receivedData);
      const valores = receivedData.split(','); // Divide a string pelos valores separados por vírgula
  
      if (valores.length === 6) {
        // Atualize os dados com base na nova leitura
        setDados({
          temperatura: `${parseFloat(valores[0]).toFixed(1)}°C`,
          pressao: `${parseFloat(valores[1]).toFixed(1)}hPa`,
          vento: `${parseFloat(valores[2]).toFixed(1)}Km/h`,
          orientacao: valores[3], // Mantém o valor da orientação (S, N, L, O)
          umidade: valores[4]+"%",
          bateria: valores[5],
        });
      }
    }
  }, [receivedData]); // Isso vai garantir que o useEffect seja chamado toda vez que 'receivedData' mudar

  const handleSendCommand = (command) => {
    if(connectedDevice){
      if (sendCommand(command)) {
        ToastAndroid.showWithGravityAndOffset(
          'Atualizando!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Erro ao atualizar!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150
        );
      }
    }else{
      ToastAndroid.showWithGravityAndOffset(
        'Dispositivo desconectado!',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        150
      );
    }
  };

  const getBateriaImage = () => {
    const nivelBateria = dados.bateria;
    if (nivelBateria > 75) return Bateria100;
    if (nivelBateria > 50) return Bateria75;
    if (nivelBateria > 25) return Bateria50;
    return Bateria25;
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewConectar}>
        <View  style={styles.viewBateria}>
          <Image style={styles.imgVento} source={getBateriaImage()}/>
          <Text style={styles.txtBateria}>{dados.bateria}%</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bluetooth')}>
          <Text style={styles.txtBtn}>Conectar</Text><Image style={styles.iconBtn} source={BluetoothIcon} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.text}>Dispositivo Conectado: {connectedDevice ? deviceName : 'Nenhum'}</Text>
      <View style={styles.divCards}>
        <Card
          title="Temperatura"
          content={dados.temperatura}
          image={Temperatura}
          style={styles.card}
        />
        <View style={styles.viewCard}>
          <View style={styles.viewHeader}>
            <Text style={styles.txtHeader}>Vento</Text>
          </View>
          <View style={styles.viewBody}>
            <Image style={styles.imgVento} source={Vento}/>
            <Text style={styles.txtBody}>{dados.vento}</Text>
          </View>
          <View style={styles.viewOri}>
            <Image style={styles.imgOri} source={Orientacao}/>
            <Text style={styles.txtOri}>{dados.orientacao}</Text>  
          </View>
        </View>
      </View>
      <View style={styles.divCards}>
        <CardGeneric
          title="Umidade"
          content={dados.umidade}
          image={Umidade}
          style={styles.CardGeneric}
        />
        <CardGeneric
          title="Pressão"
          content={dados.pressao}
          image={Medidor}
          style={styles.CardGeneric}
        />
      </View>
      <View style={styles.viewAtualizar}>
        <TouchableOpacity style={styles.button} onPress={() => handleSendCommand('up#')}>
            <Text style={styles.txtBtn}>Atualizar</Text><Image style={styles.iconBtn} source={Atualizar} />
        </TouchableOpacity>
      </View>


    </View>
  );
}

