import config from '../config.json';
import httpservice from './httpservice';

const Url = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteCourse;
const api = `${Url}/${endpoint}`;

export const DeleteCourse = (courseId) => {
    return httpservice.delete(`${api}/${courseId}`, {  withCredentials : true  })
} 
