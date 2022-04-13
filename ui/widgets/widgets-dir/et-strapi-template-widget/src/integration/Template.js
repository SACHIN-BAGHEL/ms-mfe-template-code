// TODO remove later highpriv
import axios from "axios";
import { getData } from "./Http";

// endpoints
const urlTemplates = `${process.env.REACT_APP_PUBLIC_API_URL}/template/paged`
const urlStrapi = `${process.env.STRAPI_APP_PUBLIC_API_URL}`

/*********************
 * TEMPLATES ********
 *********************/

import { addAuthorizationRequestConfig, checkForErrorsAndSendResponse } from "./Integration"


export const getAllTemplates = async (page, pageSize, selectedCollectionType) => {
    const url = `${urlTemplates}?page=${page}&pageSize=${pageSize}&collectionType=${selectedCollectionType}`;
    const { data, isError } = await getData(url)
    // eventHandler(
    //     isError,
    //     `${i18n.t('toasterMessage.impossibleToLoadCategory')} ${data ? data.message : ""}`
    // )
    return checkForErrorsAndSendResponse(data, isError, "templateList")
}

/*********************
 * COLLECTION TYPE ***
 *********************/
// todo make this method more generic or use the generic method like template declare url in env || const file.
const strapiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5NzU5MTIxLCJleHAiOjE2NTIzNTExMjF9.H8uKYT4mYNOSTs6gde9BVUYOxXI3H_Q94vBppPac1Es';

export const getCollectionTypes = async () => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${strapiToken}`
        }
    });
    return data;
}
