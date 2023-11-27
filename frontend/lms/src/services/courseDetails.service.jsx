import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.courseDetail;
const api = `${URL}/${endpoint}`

export const GetCourseDetails = (id)=>{
    return httpservice.get(`${api}/${id}`)
}