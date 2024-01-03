import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.get.adminDetails;
const api = `${URL}/${endpoints}`;


export const AdminDetails = () => {
    return httpservice.get(api, {  withCredentials : true   })
}