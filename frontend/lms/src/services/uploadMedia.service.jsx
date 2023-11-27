import httpservice from "./httpservice";
import config from '../config.json'

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.upload;
const api = `${URL}/${endPoints}`

export const UploadMedia = (data) => {
    return httpservice.post(api, data)
}