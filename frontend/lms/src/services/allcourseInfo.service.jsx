import config from '../config.json';
import httpservice from './httpservice';

const api = `${config.recurring.domainUrl}/${config.recurring.get.allcoursesInfo}`

export const allcoursesInfo = () => {
    return httpservice.get(api)
}