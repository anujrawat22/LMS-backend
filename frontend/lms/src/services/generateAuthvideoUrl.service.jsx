import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.generateAuthVideoUrl;
const api = `${URL}/${endpoint}`

export const generateAuthVideoUrl = (body) => {
    return httpservice.post(api, body, { withCredentials: true })
}