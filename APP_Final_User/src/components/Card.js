import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import api from '../services/api'
export default function ItemMenu(props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image
        source={
          props.image
            ? {
                uri: api.defaults.baseURL + '/' + props.image.replace('\\', '/'),
              }
            : require('../../assets/img/NoImage.png')
        }
        style={props.image ? styles.imagePath : styles.imageNoImage}
      />
      <Text style={styles.btnText}> {props.name} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex:1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    // backgroundColor:"red",
    width: 170,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
  },
  imagePath: {
    width: 170,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    // backgroundColor:"green",
  },
  imageNoImage: {
    width: 170,
    height: 120,
    borderRadius: 10,
    resizeMode: 'stretch',
    alignSelf: 'center',
    // backgroundColor:"green",
  },
  btnText: {
    color: 'white',
    alignSelf:"center",
    fontWeight:"bold",
    // backgroundColor:"blue"
  },
});
