import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.courseData;
const api = `${URL}/${endpoint}`

export const getCourseData = (token) => {
    return httpservice.get(api , {headers : {Authorization : `bearer ${token}`}})
}