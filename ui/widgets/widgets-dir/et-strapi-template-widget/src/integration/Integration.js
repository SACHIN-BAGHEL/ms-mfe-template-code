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


// checks if the input data contain an error and sends back either the error itself or the actual data
export const checkForErrorsAndSendResponse = (data, isError, objectLabel) => {
    if (isError) {
        return {
            errorBody: data,
            isError,
        }
    } else {
        return {
            [objectLabel]: data,
            isError,
        }
    }
}

