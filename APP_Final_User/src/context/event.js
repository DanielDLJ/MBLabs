import React, {createContext, useEffect, useState, useContext} from 'react';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import AuthContext from './auth';
const EventContext = createContext({});

export const EventProvider = ({children}) => {
  const {company, user} = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function toastMessage(message, returnStatus) {
    Toast.show({
      // type: 'success | error | info',
      type: returnStatus ? 'success' : 'error',
      position: 'top',
      text1: message,
      text2: '',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      onShow: () => {},
      onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
      onPress: () => {
        Toast.hide();
      },
      props: {}, // any custom props passed to the Toast component
    });
  }

  async function getHomeList() {
    let query = '';
    if (user) query = '?cpf=' + user.cpf;
    try {
      const result = await api.get('/timeLine' + query);
      return result.data.data;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }

  async function getEventUsersList() {
    try {
      const result = await api.get('/users/' + user.cpf + '/event');
      console.log(result.data);
      return result.data.data;
    } catch (error) {
      return [];
    }
  }

  async function getEvent() {
    let message = '';
    let returnStatus = false;
    let query = '';
    if (user) query = '?cpf=' + user.cpf;
    try {
      const result = await api.get('/event/' + selectedEvent.id + '/' + query);
      console.log('getEvent', result.data);
      setSelectedEvent(result.data.data);
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
    }
    return returnStatus;
  }

  async function updateEvent(updateEvent) {
    let message = '';
    let returnStatus = false;
    try {
      const result = await api.patch('/event/' + selectedEvent.id, updateEvent);
      console.log(result.data);
      if (result?.data?.data) setSelectedEvent(result.data.data);
      message = 'Dados atualizados =) ';
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error update', error);
      console.log('error update', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CNPJ, nome, senha ou email inválido.';
          break;
        case 404:
          message = 'Empresa não existe!';
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 4) {
            message = error.response.data.error.message;
          } else {
            message = 'Erro imprevisto';
          }
          break;
        case 500:
          message = 'Problemas com o servidor.';
          break;
        default:
          message = 'Verifique sua conexão com a internet.';
          break;
      }
    }
    toastMessage(message, returnStatus);
    return returnStatus;
  }

  async function buyEvent(quantity) {
    let message = '';
    let returnStatus = false;
    try {
      const result = await api.post('/users/' + user.cpf + '/buyEvent', {
        idEvent: selectedEvent.id,
        quantity: quantity,
      });
      message = 'Evento Comprado!';
      setSelectedEvent(result.data.data);
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error buyEvent', error);
      console.log('error buyEvent', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 2) {
            message = error.response.data.error.message;
          } else {
            message = 'Erro imprevisto';
          }
          break;
        case 500:
          message = 'Problemas com o servidor.';
          break;
        default:
          message = 'Verifique sua conexão com a internet.';
          break;
      }
    }
    toastMessage(message, returnStatus);
    return returnStatus;
  }

  async function desistEvent() {
    let message = '';
    let returnStatus = false;
    try {
      const result = await api.post('/users/' + user.cpf + '/desistEvent', {
        idEvent: selectedEvent.id,
      });
      message = 'Que pena!';
      setSelectedEvent(result.data.data);
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error desistEvent', error);
      console.log('error desistEvent', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 500:
          message = 'Problemas com o servidor.';
          break;
        default:
          message = 'Verifique sua conexão com a internet.';
          break;
      }
    }
    toastMessage(message, returnStatus);
    return returnStatus;
  }

  return (
    <EventContext.Provider
      value={{
        selectedEvent,
        setSelectedEvent,
        updateEvent,
        getHomeList,
        getEvent,
        buyEvent,
        getEventUsersList,
        desistEvent,
      }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
