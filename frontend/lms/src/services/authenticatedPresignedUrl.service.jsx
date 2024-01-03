import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.presignedUrlAuthenticated;
const api = `${URL}/${endpoint}`;

export const AuthenticatePresignedUrl = (fileName) => {
    return httpservice.get(`${api}?fileName=${fileName}`, {  withCredentials : true  })
}