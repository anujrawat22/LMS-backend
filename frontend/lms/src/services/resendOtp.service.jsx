import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.resendOTP;
const api = `${URL}/${endpoint}`;

export const resendOTP = (body) => {
    return httpservice.post(api, body)
}