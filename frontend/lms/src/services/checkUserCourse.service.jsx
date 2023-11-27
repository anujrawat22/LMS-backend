import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.checkUserCourses;
const api = `${URL}/${endpoint}`

export const CheckUserCourses = (courseId, token) => {
    return httpservice.get(`${api}/${courseId}`, { headers: { Authorization: `bearer ${token}` } })
}