import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoint = config.recurring.get.thumbnail;
const api = `${URL}/${endpoint}`

export const ThumbnailPresignedUrl = (fileName) => {
    return httpservice.get(`${api}?fileName=${fileName}`)
}