import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.sendEmail;
const api = `${URL}/${endpoint}`;

export const sendEmail = (payload) => {
    return httpservice.post(api, payload)
}