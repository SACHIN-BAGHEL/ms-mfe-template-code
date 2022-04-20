import axios from "axios";
import { KC_TOKEN_PREFIX, STRAPI_COLTYPE_URL, STRAPI_CONTYPE_URL } from "../constant/constant";
import { addAuthorizationRequestConfig } from "./Integration";

const strapiBaseUrl = `${process.env.REACT_APP_STRAPI_API_URL}`;

/**
 * Get attribute fields of given content type from strapi
 * @param {*} contentType 
 * @returns 
 */
export const getFields = async (contentType) => {
    const url = `${strapiBaseUrl}/content-manager/collection-types/${contentType}`; //TODO: use this through proxy 
    const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));

    const content = {};
    if (results && results.length) {
        const fieldsArr = Object.keys(results[0]);

        fieldsArr.map((el) => {
            content[el + "}}"] = [
                "getTextForLang(\"<LANG_CODE>\")",
                "text",
                "textMap(\"<LANG_CODE>\")"
            ]
        });
    }
    let contentObject = { 'content': content }
    return contentObject;
}


/*********************
 * Strapi COLLECTION TYPE
 *********************/

/**
 * Get strapi content types
 * @returns 
 */
//TODO: Remove commentted code later
// export const getStrapiContentTypes = async () => {
//     const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     return data;
// }

/**
 * Get strapi content types
 * @returns 
 */
export const getStrapiContentTypes = async () => {
    const url = `${strapiBaseUrl}/content-manager/content-types`; //TODO: use this through proxy
    const data = await axios.get(STRAPI_CONTYPE_URL, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    return data;
}
