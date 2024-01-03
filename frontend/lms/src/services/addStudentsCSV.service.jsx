import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.addstudentsCSV;
const api = `${URL}/${endpoint}`

export const ImportCSV = (file) => {
    return httpservice.post(api, file, { withCredentials : true })
}