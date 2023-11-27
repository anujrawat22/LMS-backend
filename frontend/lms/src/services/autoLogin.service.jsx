import config from '../config.json';
import httpservice from './httpservice';


const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.autoLogin;
const api = `${URL}/${endpoint}`

export const autologin = (token) => {
    return httpservice.post(api, { headers: { Authorization: `bearer ${token}` } })
}