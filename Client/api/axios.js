import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Quan trọng để gửi JWT trong Cookie
});

export default API;