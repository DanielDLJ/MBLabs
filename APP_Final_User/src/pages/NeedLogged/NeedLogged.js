import React, {useEffect, useContext, useState} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import {registeredUser, unregisteredUser} from '../../constants';
import AuthContext from '../../context/auth';

function NeedLogged(props) {
  const {user} = useContext(AuthContext);
  const actionOnRow = async item => {
    if (item.id === 3) {
        props.navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Entre ou crie uma conta para continuar!
      </Text>
      <FlatList
        style={styles.list}
        data={unregisteredUser}
        numColumns={1}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => actionOnRow(item)}
              style={styles.item}>
              <View style={styles.containerCard}>
                <View style={styles.containerImage}>{item.icon}</View>
                <View style={styles.containerRow}>
                  <Text style={styles.itemTitleText}>{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
  },

  titleText: {
    color: '#f0f0f0',
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 40,
  },

  /******** List Container **************/
  list: {
    //paddingVertical: 5,
    backgroundColor: 'transparent',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    // backgroundColor: 'red',
  },

  item: {
    padding: 5,
    // backgroundColor: 'red',
    flexDirection: 'column',
    //paddingLeft: 30,
  },

  containerCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    //backgroundColor: 'white',
  },

  containerImage: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },

  containerRow: {
    padding: 0,
    flexDirection: 'row',
    paddingRight: 30,
  },

  itemTitleText: {
    color: '#f0f0f0',
    marginLeft: 16,
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 16,
  },
});

export default NeedLogged;
