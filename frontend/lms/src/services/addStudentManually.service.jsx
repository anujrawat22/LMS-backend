import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.post.addstudentManually;
const api = `${URL}/${endpoint}`

export const AddStudentManually = (payload, token) => {
    return httpservice.post(api, payload, { headers: { Authorization: `bearer ${token}` } })
}