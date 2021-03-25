import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  icon: {
    padding: 9,
    backgroundColor:"transparent"
  },
});

export const registeredUser = [
  {
    id: 1,
    title: 'Perfil',
    icon: <AntDesignIcon style={styles.icon} name="profile" size={20} color={"white"} />,
  },
  {
    id: 2,
    title: 'Pagamentos',
    icon: <FontAwesome style={styles.icon} name="credit-card" size={20} color={"white"} />,
  },
  {
    id: 3,
    title: 'Sair',
    icon: <MaterialCommunityIcon style={styles.icon} name="logout" size={20} color={"white"} />,
  },
];

export const unregisteredUser = [
    {
      id: 3,
      title: 'Logar',
      icon: <MaterialCommunityIcon style={styles.icon} name="login" size={20} color={"white"} />,
    },
];
