import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5275/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
