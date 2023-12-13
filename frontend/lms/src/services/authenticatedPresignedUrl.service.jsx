import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.presignedUrlAuthenticated;
const api = `${URL}/${endpoint}`;

export const AuthenticatePresignedUrl = (fileName, token) => {
    return httpservice.get(`${api}?fileName=${fileName}`, { headers: { Authorization: `bearer ${token}` } })
}