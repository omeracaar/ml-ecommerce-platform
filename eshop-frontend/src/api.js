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

//401 handle kismi ornek olarak jwt expired olmus ise
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // status 401 ise
    if (error.response && error.response.status === 401) {
      console.error("Token süresi dolmuş veya geçersiz! Otomatik çıkış yapılıyor.");
      
      //local den username ve tokeni sil
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      //user i logine yönlendir 
      window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);


export default api;