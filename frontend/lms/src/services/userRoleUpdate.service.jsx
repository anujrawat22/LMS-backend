import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.update.user_role_update
const api = `${URL}/${endpoint}`

export const UpdateUserRoleService = (role, userId) => {
    return httpservice.patch(`${api}/${userId}`, {
        role
    }, {  withCredentials : true });
}