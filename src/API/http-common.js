import axios from 'axios';
import config from '~/config';
export default axios.create({
  baseURL: `${config.apiBase}/`,
  headers: {
    "Content-type": "application/json"
  }
});