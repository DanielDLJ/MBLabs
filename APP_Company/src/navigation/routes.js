import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './authNavigator';
import HomeStack from './mainNavigator';
import AuthContext  from '../context/auth';
import TelaCarregamento  from '../pages/TelaCarregamento/TelaCarregamento';
import Toast from 'react-native-toast-message'

export default function Routes() {
  const { company, isLoadingSplash, isLoadingAuth} = useContext(AuthContext);


  if (isLoadingAuth || isLoadingSplash) {
    return <TelaCarregamento />;
  }

  return (
    <NavigationContainer >
      {company ? <HomeStack /> : <AuthStack />}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}