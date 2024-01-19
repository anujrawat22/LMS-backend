import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.post.SendVerificationEmail;
const api = `${URL}/${endpoints}`

export const sendVerificationEmail = (body) => {
    return httpservice.post(api, body)
}