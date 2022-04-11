// TODO remove later highpriv
import axios from "axios";
import { getData } from "./Http";

// endpoints
const urlTemplates = `${process.env.REACT_APP_PUBLIC_API_URL}/template/paged`
const urlStrapi = `${process.env.STRAPI_APP_PUBLIC_API_URL}/`

/*********************
 * TEMPLATES ********
 *********************/

import { checkForErrorsAndSendResponse } from "./Integration"


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

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ4NDQxMjUwLCJleHAiOjE2NTEwMzMyNTB9.azaYPs05KQR_vkCltU3onTqhSWOuCpMvwaAt4VAcKTg';

export const getCollectionTypes = async () => {
    const data = await axios.get(`${urlStrapi}content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return data;
}
