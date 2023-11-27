import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteLesson;
const api = `${URL}/${endpoint}`;

export const DeleteLesson = (courseId, sectionId, lessonId, token) => {
    return httpservice.delete(`${api}/${courseId}/${sectionId}/${lessonId}`, { headers: { Authorization: `bearer ${token}` } })
}