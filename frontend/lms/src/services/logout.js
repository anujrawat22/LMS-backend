
import config from '../config.json';

export const handleUserLogout = async () => {
    const api = `${config.recurring.domainUrl}/${config.recurring.post.logout}`
    try {
        const res = await fetch(api, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': "application/json"
            }
        })
        console.log(res)
    } catch (error) {
        console.log(error)
    }
}