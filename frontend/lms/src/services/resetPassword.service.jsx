import config from '../config.json';
import httpservice from './httpservice';


const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.resetPassword
const api = `${URL}/${endPoints}`

export const ResetPassword = (payload) => {
    return httpservice.post(api, payload)
}