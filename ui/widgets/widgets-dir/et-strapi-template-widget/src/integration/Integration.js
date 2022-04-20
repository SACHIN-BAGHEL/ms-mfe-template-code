// Get authrization tokens
export const addAuthorizationRequestConfig = (config = {}, defaultBearer = 'Bearer') => {
    let defaultOptions = getDefaultOptions(defaultBearer);
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


const getDefaultOptions = (defaultBearer) => {
    const token = getKeycloakToken()
    if (!token) return {}
    return {
        headers: {
            Authorization: `${defaultBearer} ${token}`,
        },
    }
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

