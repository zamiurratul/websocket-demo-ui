import axios from 'axios';

const HttpService = axios.create({
    timeout: 60000
});

export default HttpService;