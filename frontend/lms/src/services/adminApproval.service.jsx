import config from '../config.json';
import httpservice from './httpservice';

const URL = config.recurring.domainUrl;
const endpoints = config.recurring.post.approvalRequest;
const api = `${URL}/${endpoints}`;

export const ApprovalRequest = ({ value, id, token }) => {
    const newapi = `${api}/${value}/${id}`
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return httpservice.post(newapi, config)
}