import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endPoint = config.recurring.post.ImagePresignedUrl;
const api = `${URL}/${endPoint}`;

export const ImagePresignedUrl = (query) => {
    return httpservice.post(`${api}?${query}`, {  withCredentials : true  })
}