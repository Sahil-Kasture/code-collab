import axios from 'axios';

const API = axios.create({
  baseURL: 'https://server-p9j7.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
