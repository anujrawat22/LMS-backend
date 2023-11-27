import config from '../config.json';
import httpservice from './httpservice';


const URl = config.recurring.domainUrl;
const endpoints = config.recurring.post.addCourse;
const api = `${URl}/${endpoints}`;

export const AddCourse = (payload, token) => {
    return httpservice.post(api, payload, { headers: { Authorization: `bearer ${token}` } })
}