// src/components/Card.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Card = ({ title, content, image, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {content && (
        <View style={styles.contentContainer}>
          <Image style={styles.img} source={image}/>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center', // Centraliza na horizontal
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    color: 'rgb(96, 94, 255);',
    textAlign: 'center',
    fontFamily:"Nunito-Bold"
  },
  contentContainer: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 24,
    color: 'rgb(96, 94, 255);',
    textAlign: 'center',
    fontFamily:"Nunito-ExtraBold"
  },
  img:{
    width:40,
    height:40,
  }
});

export default Card;
