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


export const getAllTemplates = async (page, pageSize) => {
    const url = `${urlTemplates}?page=${page}&pageSize=${pageSize}`;
    const { data, isError } = await getData(url)
    // eventHandler(
    //     isError,
    //     `${i18n.t('toasterMessage.impossibleToLoadCategory')} ${data ? data.message : ""}`
    // )
    return checkForErrorsAndSendResponse(data, isError, "templateList")
}

/*********************
 * COLLECTION TYPE ********
 *********************/

const strapiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5NzUxMDQ2LCJleHAiOjE2NTIzNDMwNDZ9.AGCSqvLtOSvq4GoZWmce2STiWBAkrllNdprx-n0mFFg';

export const getCollectionTypes = async () => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`, addAuthorizationRequestConfig({}, 'EntKcToken'));
    return data;
}
