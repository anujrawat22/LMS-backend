import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.post.signup;
const api = `${URL}/${endpoints}`


export const adminSignup = (data) => {
    return httpservice.post(api, data)
}