import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endPoint = config.recurring.post.ImagePresignedUrl;
const api = `${URL}/${endPoint}`;

export const ImagePresignedUrl = (query, token) => {
    return httpservice.post(`${api}?${query}`, { headers: { Authorization: `bearer ${token}` } })
}