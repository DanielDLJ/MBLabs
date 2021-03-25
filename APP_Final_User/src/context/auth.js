import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from "../services/api"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setLoadingAuth] = useState(true);
  const [isLoadingSplash, setLoadingSplash] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // const fakeUser = {
      //   cpf: "41999741803",
      //   name: "Daniel",
      //   image: ""
      // }
      // await clearStorage()
      // await storeUser(fakeUser)

      const storedUser = await getStoredUser();
      if (storedUser != null) {
        setUser(storedUser);
      }

      setLoadingAuth(false);
      console.info('[AuthContext]', 'Finished loading.');
    }
    loadStorageData();
  }, []);


  useEffect(() => {
    console.info('[AuthContext user]', user);
  }, [user]);


  async function signIn(cpf, password) {
    let message = ""
    let returnStatus = false
    try {
      const result = await api.post('/auth/login', {
        cpf,
        password,
      })
      await storeUser(result.data.data)
      message = "Bem-vindo " + result.data.data.name
      returnStatus = true;
    } catch (error) {
      console.log(error)
      returnStatus = false;
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CPF ou senha inválido.'
          break;
        case 404:
          message = 'CPF não existe.'
          break;
        case 401:
          message = 'CPF ou senha inválidos..'
          break;
        case 500:
          message = 'Problemas com o servidor.'
          break;
        default:
          message = 'Verifique sua conexão com a internet.'
          break;
      }
    }
    toastMessage(message,returnStatus)
    return returnStatus
  }

  function toastMessage(message, returnStatus) {
    Toast.show({
      // type: 'success | error | info',
      type: returnStatus ? 'success' : 'error' ,
      position: 'top',
      text1: message,
      text2: "",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      onShow: () => {},
      onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
      onPress: () => {
        Toast.hide()
      },
      props: {} // any custom props passed to the Toast component
    });
  }

  async function signUp(newUser) {
    let message = ""
    let returnStatus = false
    try {
      const result = await api.post('/users', newUser);
      console.log(result.data)
      await storeUser(result.data.data)
      message = "Bem-vindo " + result.data.data.name
      returnStatus = true 
    } catch (error) {
      returnStatus = false 
      console.log('error Register', error);
      console.log('error Register', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CPF, nome, senha ou email inválido.'
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 3 || errorCode === 4) {
            message = error.response.data.error.message
          }else{
            message = "Erro imprevisto"
          }
          break;
        case 500:
          message = 'Problemas com o servidor.'
          break;
        default:
          message = 'Verifique sua conexão com a internet.'
          break;
      }
    }
    toastMessage(message,returnStatus)
    return returnStatus

  }

  async function update(updateUser) {
    let message = ""
    let returnStatus = false
    try {
      const result = await api.patch('/users/'+user.cpf, updateUser);
      console.log(result.data)
      await storeUser(result.data.data)
      message = "Dados atualizados =) "
      returnStatus = true 
    } catch (error) {
      returnStatus = false 
      console.log('error update', error);
      console.log('error update', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CPF, nome, senha ou email inválido.'
          break;
        case 404:
          message = "Usuário não existe!"
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 4) {
            message = error.response.data.error.message
          }else{
            message = "Erro imprevisto"
          }
          break;
        case 500:
          message = 'Problemas com o servidor.'
          break;
        default:
          message = 'Verifique sua conexão com a internet.'
          break;
      }
    }
    toastMessage(message,returnStatus)
    return returnStatus
  }

  function logout() {
    clearStorage().then(() => {
      setUser(null);
    });
  }

  async function clearStorage() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }

  async function getStoredUser() {
    try {
      const cpf = await AsyncStorage.getItem('user_cpf');
      const name = await AsyncStorage.getItem('user_name');
      const image = await AsyncStorage.getItem('user_image');

      if (cpf == null) {
        return null;
      }

      return {
        cpf: cpf,
        name: name ? name : "",
        image: image ? image : "",
      };
    } catch (e) {
      console.log('[AuthProvider getData]', e);
    }
  }

  async function storeUser(_user) {
    try {
      console.log("storeUser",_user)
      await AsyncStorage.setItem('user_cpf', _user.cpf);
      await AsyncStorage.setItem('user_name', _user.name);
      await AsyncStorage.setItem('user_image', _user.image);
      setUser(_user)
    } catch (e) {
      console.log('[AuthContext storeDataUser]', e);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: user != null,
        isLoadingAuth,
        user,
        isLoadingSplash,
        storeUser,
        setLoadingSplash,
        signIn,
        signUp,
        logout,
        update,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
