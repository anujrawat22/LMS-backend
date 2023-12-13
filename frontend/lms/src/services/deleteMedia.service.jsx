import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteMedia;
const api = `${URL}/${endpoint}`;

export const DeleteMedia = (Key, type, token) => {
    console.log(Key)
    return httpservice.delete(`${api}?Key=${Key}&folder=${type}`, { headers: { Authorization: `bearer ${token}` } })
}