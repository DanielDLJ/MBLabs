import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from "../services/api"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [isLoadingAuth, setLoadingAuth] = useState(true);
  const [isLoadingSplash, setLoadingSplash] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const fakeCompany = {
        cnpj: "12100515000142",
        name: "Rock in Rio",
      }

      await clearStorage()
      // await storeCompany(fakeCompany)

      const storedCompany = await getStoredCompany();
      if (storedCompany != null) {
        setCompany(storedCompany);
      }

      setLoadingAuth(false);
      console.info('[AuthContext]', 'Finished loading.');
    }
    loadStorageData();
  }, []);


  useEffect(() => {
    console.info('[AuthContext Company]', company);
  }, [company]);


  async function signIn(cnpj, password) {
    let message = ""
    let returnStatus = false
    try {
      const result = await api.post('/auth/login', {
        cnpj,
        password,
      })
      await storeCompany(result.data.data)
      message = "Bem-vindo " + result.data.data.name
      returnStatus = true;
    } catch (error) {
      console.log(error)
      returnStatus = false;
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CNPJ ou senha inválido.'
          break;
        case 404:
          message = 'CNPJ não existe.'
          break;
        case 401:
          message = 'CNPJ ou senha inválidos..'
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

  async function signUp(newCompany) {
    let message = ""
    let returnStatus = false
    try {
      const result = await api.post('/company', newCompany);
      console.log(result.data)
      await storeCompany(result.data.data)
      message = "Bem-vindo " + result.data.data.name
      returnStatus = true 
    } catch (error) {
      returnStatus = false 
      console.log('error Register', error);
      console.log('error Register', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CNPJ, nome, senha ou email inválido.'
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

  function signOut() {
    clearStorage().then(() => {
      setCompany(null);
    });
  }

  async function clearStorage() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }

  async function getStoredCompany() {
    try {
      const cnpj = await AsyncStorage.getItem('company_cnpj');
      const name = await AsyncStorage.getItem('company_name');

      if (cnpj == null) {
        return null;
      }

      return {
        cnpj: cnpj,
        name: name ? name : "",
      };
    } catch (e) {
      console.log('[AuthProvider getData]', e);
    }
  }

  async function storeCompany(_company) {
    try {
      console.log("storeCompany",_company)
      await AsyncStorage.setItem('company_cnpj', _company.cnpj);
      await AsyncStorage.setItem('company_name', _company.name);
      setCompany(_company)
    } catch (e) {
      console.log('[AuthContext storeDataCompany]', e);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: company != null,
        isLoadingAuth,
        company,
        isLoadingSplash,
        storeCompany,
        setLoadingSplash,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
