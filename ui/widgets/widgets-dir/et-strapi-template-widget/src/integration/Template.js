// TODO remove later highpriv
import axios from "axios";
import { getData } from "./Http";

// endpoints
const urlTemplates = `${process.env.REACT_APP_PUBLIC_API_URL}/template/`
const urlStrapi = `${process.env.STRAPI_APP_PUBLIC_API_URL}/`

/*********************
 * TEMPLATES ********
 *********************/

import { checkForErrorsAndSendResponse } from "./Integration"


export const getAllTemplates = async () => {
    const { data, isError } = await getData(urlTemplates)
    // eventHandler(
    //     isError,
    //     `${i18n.t('toasterMessage.impossibleToLoadCategory')} ${data ? data.message : ""}`
    // )
    return checkForErrorsAndSendResponse(data, isError, "categoryList")
}

/*********************
 * COLLECTION TYPE ********
 *********************/

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ4NDQxMjUwLCJleHAiOjE2NTEwMzMyNTB9.azaYPs05KQR_vkCltU3onTqhSWOuCpMvwaAt4VAcKTg';

export const getCollectionTypes = async () => {
    const data = await axios.get(`${urlStrapi}content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return data;
}

//  export const getAllTemplates = async () => {
//     const { data, isError } = await getData(urlTemplates)

//     console.log("getAllTemplates", data);
//     return checkForErrorsAndSendResponse(data, isError, "categoryList")
// }