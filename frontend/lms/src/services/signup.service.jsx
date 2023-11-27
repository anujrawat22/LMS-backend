import config from '../config.json'
import httpservice from './httpservice'

const URL = config.recurring.domainUrl
const endPoints = config.recurring.post.signup
const api = `${URL}/${endPoints}`

export const UserSignup = (data) => {
    return httpservice.post(api, data)
}