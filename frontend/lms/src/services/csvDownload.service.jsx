import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.get.csvDownload;
const api = `${URL}/${endpoints}`;

export const CSVDownload = (filters) => {
    return httpservice.get(`${api}?${filters}`, { responseType: 'blob' })
}