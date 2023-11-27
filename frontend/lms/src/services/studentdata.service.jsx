import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.allstudents;
const api = `${URL}/${endPoints}`

export const studentsData = (filters, token) => {
    return httpservice.get(`${api}?${filters}`, { headers: { Authorization: `bearer ${token}` } })
}