import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use 10.0.2.2 for Android Emulator, localhost for iOS simulator
const API_URL = 'http://10.0.2.2:5000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
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
