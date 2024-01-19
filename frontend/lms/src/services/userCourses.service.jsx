import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.userCourses;
const api = `${URL}/${endpoint}`

export const userCourses = () => {
    return httpservice.get(api, { withCredentials: true })
}