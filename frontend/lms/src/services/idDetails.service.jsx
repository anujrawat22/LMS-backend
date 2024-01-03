import config from '../config.json';
import httpservice from './httpservice';


const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.studentdetail;
const api = `${URL}/${endPoints}`;

export const studentDetailsbyId = (id) => {
    return httpservice.get(`${api}/${id}`, {  withCredentials : true  })
}