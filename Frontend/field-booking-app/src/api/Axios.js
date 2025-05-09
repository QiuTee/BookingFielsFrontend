import axios from 'axios';

const getAxiosInstance = () => {
  const token = localStorage.getItem('access_token');  

  const instance = axios.create({
    baseURL: ' http://localhost:5109/api', 
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

 
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("Hết hạn phiên đăng nhập hoặc chưa đăng nhập!");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default getAxiosInstance;
