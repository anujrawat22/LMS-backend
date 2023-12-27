import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.courseData;
const api = `${URL}/${endpoint}`

export const getCourseData = (page, title) => {
    return httpservice.get(`${api}?page=${page}&title=${title}`)
}