import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-paper';
import api from '../../services/api';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
function EditEvent(props) {
  const {user} = useContext(AuthContext);
  const {selectedEvent, getEvent, desistEvent} = useContext(EventContext);

  useEffect(() => {}, [selectedEvent]);
  useEffect(() => {
    props.navigation.setOptions({
      title: selectedEvent?.category?.name ? selectedEvent?.category?.name : '',
    });
  }, []);

  useEffect(() => {
    if (user !== null) getEvent();
  }, [user]);

  const handleBuy = () => {
    if (user) {
      props.navigation.navigate('BuyEvent');
    } else {
      props.navigation.navigate('Login');
    }
  };

  const handleDesist = () => {
    desistEvent();
  };

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

              <View>
                <Text style={styles.textTtitle}>{selectedEvent?.name}</Text>
                <Text style={styles.textSubTitle}>
                  {selectedEvent?.description}
                </Text>
                {selectedEvent?.user_events?.length > 0 ? (
                  <Text style={styles.textQuantity}>
                    Quantidade: {selectedEvent?.user_events[0].quantity}
                  </Text>
                ) : null}
              </View>

              <View style={{flexDirection: 'row'}}>
                {user === null || selectedEvent?.user_events?.length === 0 ? (
                  <Button
                    // loading={loading}
                    style={[styles.btn, {marginRight: 20}]}
                    mode="contained"
                    onPress={() => handleBuy()}>
                    {user === null ? 'Logar e ' : ''}Comprar
                  </Button>
                ) : null}
                {user !== null && selectedEvent?.user_events?.length > 0 ? (
                  <Button
                    // loading={loading}
                    style={[styles.btn, {backgroundColor: 'red'}]}
                    mode="contained"
                    onPress={() => handleDesist()}>
                    Desistir
                  </Button>
                ) : null}
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
  textTtitle: {
    marginTop: 20,
    marginBottom: 0,
    fontSize: 25,
    alignSelf: 'center',
    color: 'white',
  },
  textSubTitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 16,
    alignSelf: 'flex-start',
    color: 'black',
  },
  textQuantity: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 16,
    alignSelf: 'center',
    color: 'black',
  },
  btn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(70, 70, 70, 0.85)',
  },
});

export default EditEvent;
