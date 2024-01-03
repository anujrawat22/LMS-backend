import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteSection;
const api = `${URL}/${endpoint}`;

export const DeleteSection = (courseId, sectionId) => {
    return httpservice.delete(`${api}/${courseId}/${sectionId}`, {  withCredentials : true  })
}