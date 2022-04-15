// TODO remove later highpriv
import axios from "axios";
import { deleteData, getData, postData } from "./Http";

// endpoints
const templateBaseUrl = `${process.env.REACT_APP_PUBLIC_API_URL}/template/`
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
    // let url = "http://localhost:8081/api/template/";
    const { data, isError } = await postData(urlAddTemplate, templateData);
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
const strapiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5OTMzODA5LCJleHAiOjE2NTI1MjU4MDl9.1nRNKrcorlfu5z4Pz4H-0zVkwFKBJiZTGW2sgfHA5KU';

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

// export const getCollectionTypes = async () => {
//     const data = await axios.get(`http://localhost:1337/content-manager/content-types`, addAuthorizationRequestConfig({}, 'EntKcToken'));
//     return data;
// }


/**
 * Delete a template
 * @param {} page 
 * @param {*} pageSize 
 * @param {*} selectedCollectionType 
 * @returns 
 */
export const deleteTemplate = async (templateId) => {
    const { data, isError } = await deleteData(templateBaseUrl, templateId)
    // eventHandler(
    //     isError,
    //     `${i18n.t('toasterMessage.impossibleToLoadCategory')} ${data ? data.message : ""}`
    // )
    console.log('10101010 ', data);
    return checkForErrorsAndSendResponse(data, isError, "response")
}