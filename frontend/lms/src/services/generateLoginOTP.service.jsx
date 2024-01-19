import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.post.GenerateLoginOTP;
const api = `${URL}/${endpoints}`;

export const generateLoginOTP = (body) => {
    return httpservice.post(api, body)
}