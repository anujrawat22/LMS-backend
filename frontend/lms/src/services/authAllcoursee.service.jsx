import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.authAllCourses;
const api = `${URL}/${endpoint}`;

export const authAllcourses = (page, title) => {
    return httpservice.get(`${api}?page=${page}&title=${title}`, { withCredentials: true })
}