import config from '../config.json';
import httpservice from './httpservice';

const Url = config.recurring.domainUrl;
const endpoint = config.recurring.update.updateLesson;
const api = `${Url}/${endpoint}`

export const UpdateLesson = (courseId, sectionId, lesson) => {
    return httpservice.patch(`${api}/${courseId}/${sectionId}`, lesson, {  withCredentials : true  })
}