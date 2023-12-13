import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.presignedUrl;
const api = `${URL}/${endpoint}`

export const PresignedUrl = (fileName, courseId, sectionId, lessonId) => {
    return httpservice.get(`${api}/${courseId}/${sectionId}/${lessonId}?fileName=${fileName}`)
}