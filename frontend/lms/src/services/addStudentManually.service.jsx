import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.addstudentManually;
const api = `${URL}/${endpoint}`

export const AddStudentManually = (payload) => {
    return httpservice.post(api, payload, { withCredentials: true })
}