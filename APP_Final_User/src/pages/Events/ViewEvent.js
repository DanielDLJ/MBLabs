import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import api from '../../services/api';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
import TextInput from '../../components/TextInput';
import {TextInputMask} from 'react-native-masked-text';
import BottomSheet from '../../components/BottomSheet';
import ImagePicker from 'react-native-image-crop-picker';
function EditEvent({navigation}) {
  const {company} = useContext(AuthContext);
  const {
    updateEvent,
    setSelectedEvent,
    selectedEvent,
    deleteEvent,
  } = useContext(EventContext);

  useEffect(() => {}, [selectedEvent]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.innerContainer}>
            <View
              style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Image
                source={
                  selectedEvent?.image
                    ? {
                        uri:
                          api.defaults.baseURL +
                          '/' +
                          selectedEvent?.image.replace('\\', '/'),
                      }
                    : require('../../../assets/img/NoImage.png')
                }
                style={
                  selectedEvent?.image ? styles.imagePath : styles.imageNoImage
                }
              />

              <View style={{flexDirection: 'row'}}>
                <Button
                  // loading={loading}
                  style={[styles.btn, {marginRight: 20}]}
                  mode="contained"
                  onPress={() => handleSubmit()}>
                  Comprar
                </Button>

                <Button
                  // loading={loading}
                  style={[styles.btn, {backgroundColor: 'red'}]}
                  mode="contained"
                  onPress={() => handleDelete()}>
                  Desistir
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
  },
  innerContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingTop: 50,
  },
  imagePath: {
    width: 170,
    height: 120,
    marginTop: 15,
    alignSelf: 'center',
    // backgroundColor:"red"
  },
  imageNoImage: {
    // height:'100%',
    // width:'100%',
    width: 170,
    height: 120,
    resizeMode: 'stretch',
    alignSelf: 'center',
    // backgroundColor:"red"
  },
  gif: {
    flex: 1,
    position: 'absolute',
    height: 50,
    width: 50,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  text: {
    marginTop: 20,
    marginBottom: 0,
    fontSize: 20,
    alignSelf: 'flex-start',
    color: 'white',
  },
  textError: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 17,
    alignSelf: 'flex-start',
    color: 'red',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cilp: {
    marginTop: 8,
  },
  btn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(70, 70, 70, 0.85)',
  },
});

export default EditEvent;
