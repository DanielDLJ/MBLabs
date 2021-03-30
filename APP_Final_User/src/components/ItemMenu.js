import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
export default function ItemMenu(props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <SimpleLineIcons name={props.nameIcon} size={20} color={'white'} />
      <Text style={styles.btnText}> {props.name} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex:1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 140,
    padding: 10,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
  },
  btnText: {
    marginTop: 15,
    color:"white"
  },
});
