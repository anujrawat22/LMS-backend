import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.unassignCourse;
const api = `${URL}/${endpoint}`

export const UnassignCourse = (userId, courseId) => {
    return httpservice.delete(`${api}/${userId}/${courseId}`, {  withCredentials : true  })
}