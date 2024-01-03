import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteMedia;
const api = `${URL}/${endpoint}`;

export const DeleteMedia = (Key, type) => {
    console.log(Key)
    return httpservice.delete(`${api}?Key=${Key}&folder=${type}`, {  withCredentials : true  })
}