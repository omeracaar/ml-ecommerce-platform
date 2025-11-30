import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/rest/api',
});

// interceptor ekledim
api.interceptors.request.use(
  (config) => {
    // LocalStorage'dan token'ı al
    const token = localStorage.getItem('token');
    
    //token varsa header a ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;