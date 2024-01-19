import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.generateVideoUrl;
const api = `${URL}/${endpoint}`

export const getVideoUrl = (endpoints, body) => {
    return httpservice.post(`${api}/${endpoints}`, body)
}