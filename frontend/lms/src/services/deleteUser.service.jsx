import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.delete.deleteUser;
const api = `${URL}/${endpoint}`

export const DeleteUserService = (userId) => {
    return httpservice.delete(`${api}/${userId}`, {  withCredentials : true })
}