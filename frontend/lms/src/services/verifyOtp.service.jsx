import config from '../config.json'
import httpservice from './httpservice'

const URL = config.recurring.domainUrl
const endPoints = config.recurring.post.verifyOtp
const api = `${URL}/${endPoints}`

export const verifyOtp = (payload) => {
    return httpservice.post(api, payload)
}