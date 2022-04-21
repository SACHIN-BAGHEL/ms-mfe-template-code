import axios from "axios";
import { KC_TOKEN_PREFIX } from "../constant/constant";
import { addAuthorizationRequestConfig } from "./Integration";

const strapiBaseUrl = `${process.env.REACT_APP_STRAPI_API_URL}`;

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
    const url = `${strapiBaseUrl}/content-manager/content-types`;
    // const data = await axios.get(STRAPI_CONTYPE_URL, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    const data = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    return data;
}
