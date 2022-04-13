// TODO remove later highpriv
import axios from "axios";
import { getData, postData } from "./Http";

// endpoints
const urlTemplates = `${process.env.REACT_APP_PUBLIC_API_URL}/template/paged`
const urlStrapi = `${process.env.STRAPI_APP_PUBLIC_API_URL}/`
const urlAddTemplate = `${process.env.REACT_APP_PUBLIC_API_URL}/template/`
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

export const addNewTemplate = async (templateData) => {
    let url = "http://localhost:8081/api/template/";
    console.log("urlAddTemplate",urlAddTemplate);
    const { data, isError } = await postData(urlAddTemplate,templateData);
    // eventHandler(
    //   isError,
    //   `${i18n.t('toasterMessage.impossibleToCreateBundle')} ${data ? data.message : ""}`,
    //   `${i18n.t('toasterMessage.bundle')} ${data.data ? data.data.name : ""} ${i18n.t('toasterMessage.created')}`
    // )
    return checkForErrorsAndSendResponse(data, isError, "newTemplate")
  }

/*********************
 * COLLECTION TYPE ***
 *********************/
// todo make this method more generic or use the generic method like template declare url in env || const file.
const strapiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5ODUxMjI2LCJleHAiOjE2NTI0NDMyMjZ9.ia9ND5V0CZ_k4osmG8-K6IJiFXlzHxR3qmKh8XDGal4';

// export const getCollectionTypes = async () => {
//     const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
//         headers: {
//             'Authorization': `Bearer ${strapiToken}`
//         }
//     });
//     return data;
// }


export const getCollectionTypes = async () => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${strapiToken}`
        }
    });
    return data;
}