import config from '../config.json';
import httpservice from './httpservice';


const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.forgetPassword
const api = `${URL}/${endPoints}`

export const resetPassword = (payload) => {
    return httpservice.post(api, payload)
}