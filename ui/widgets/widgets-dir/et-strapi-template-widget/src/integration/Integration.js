import axios from "axios";

let endpoint = `${process.env.STRAPI_APP_URL}`

const addAuthorizationRequestConfig = (config = {}) => {
    let defaultOptions = getDefaultOptions();
    return {
        ...config,
        ...defaultOptions
    }
}

const getKeycloakToken = () => {
    if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated) {
        return window.entando.keycloak.token
    }
    return ''
}


const getDefaultOptions = () => {
    const token = getKeycloakToken()
    if (!token) return {}
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}


export const getData = async () => {
    const responseObj = {}
    try {
        endpoint = `http://localhost:1337/api/banners?filters[id][$eq]=1`
        responseObj["response"] = await axios.get(endpoint, addAuthorizationRequestConfig())
        console.log('responseObj["response"]', responseObj["response"].data.data);
    } catch (error) {
        console.error(error)
        responseObj["error"] = error
    }
    return responseObj
}




