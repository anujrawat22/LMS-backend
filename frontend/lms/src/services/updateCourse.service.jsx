import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.put.updateCourse;
const api = `${URL}/${endpoint}`


export const UpdateCourse = (courseId, payload, token) => {
    return httpservice.put(`${api}/${courseId}`, payload, { headers: { Authorization: `bearer ${token}` } })
}