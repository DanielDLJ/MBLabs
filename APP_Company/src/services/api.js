import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.16:3336', //Local
});

api.interceptors.response.use((response) => {
   if (response.data.error) {
     throw response;
   } else {
     return response;
   }
});

export default api;
