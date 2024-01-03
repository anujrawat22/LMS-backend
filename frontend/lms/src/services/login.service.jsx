import config from '../config.json'
import httpservice from './httpservice'

const URL = config.recurring.domainUrl
const endPoints = config.recurring.post.login
const api = `${URL}/${endPoints}`

export const UserLogin = (userdata) => {
    return httpservice.post(api, userdata, { withCredentials: true })
}