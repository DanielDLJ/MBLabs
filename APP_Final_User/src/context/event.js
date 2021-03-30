import React, {createContext, useEffect, useState, useContext} from 'react';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import AuthContext from './auth';
const EventContext = createContext({});

export const EventProvider = ({children}) => {
  const {company} = useContext(AuthContext);
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
    try {
      const result = await api.get('/timeLine');
      console.log(result.data);
      return result.data.data;
    } catch (error) {
      console.log("error",error)
      return [];
    }
  }

  async function getEventUsersList() {
    try {
      const result = await api.get('/event/' + selectedEvent.id + '/users');
      console.log(result.data);
      return result.data.data;
    } catch (error) {
      return [];
    }
  }

  async function getEvent(id) {
    let message = '';
    let returnStatus = false;
    try {
      const result = await api.post('/event', newCompany);
      console.log(result.data);
      await storeCompany(result.data.data);
      message = 'Bem-vindo ' + result.data.data.name;
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error Register', error);
      console.log('error Register', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de CNPJ, nome, senha ou email inválido.';
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 3 || errorCode === 4) {
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

  async function createEvent(createEvent) {
    let message = '';
    let returnStatus = false;
    try {
      console.log('company_cnpj', company.cnpj);
      createEvent.append('company_cnpj', company.cnpj);
      const result = await api.post('/event', createEvent);
      console.log(result.data);
      message = 'Evento Criado =) ';
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error update', error);
      console.log('error update', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de nome, descrição ou categoria inválido.';
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 3 || errorCode === 4) {
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

  async function deleteEvent() {
    let message = '';
    let returnStatus = false;
    try {
      const result = await api.delete('/event/'+selectedEvent.id);
      message = 'Evento Deletado!';
      setSelectedEvent({...selectedEvent,id:-1})
      returnStatus = true;
    } catch (error) {
      returnStatus = false;
      console.log('error update', error);
      console.log('error update', error.response);
      switch (error.response === undefined ? 65465 : error.response.status) {
        case 406:
          message = 'Formato de nome, descrição ou categoria inválido.';
          break;
        case 409:
          const errorCode = error.response.data.error.code;
          if (errorCode === 3 || errorCode === 4) {
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

  return (
    <EventContext.Provider
      value={{
        selectedEvent,
        setSelectedEvent,
        updateEvent,
        getHomeList,
        getEvent,
        createEvent,
        getEventUsersList,
        deleteEvent,
      }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
