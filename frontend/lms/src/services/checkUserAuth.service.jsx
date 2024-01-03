import config from '../config.json';

const api = `${config.recurring.domainUrl}/${config.recurring.post.checkUserAuth}`

export const checkUserAuth = () => {
    return fetch(api, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-type": "Application/json"
        }
    })
}