import axios from "axios";
import { KC_TOKEN_PREFIX, STRAPI_COLTYPE_URL } from "../constant/constant";
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
export const getStrapiContentTypes = async () => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwNDQ5NjEyLCJleHAiOjE2NTMwNDE2MTJ9.6MiSNj9LIe5_jooQLAVflzPulWvOczBNKXQuLJCg1Zc'}`
        }
    });
    return data;
}

/**
 * Get strapi content types
 * @returns 
 */
// export const getStrapiContentTypes = async () => {
//     const url = `${strapiBaseUrl}/content-manager/content-types`;
//     // const data = await axios.get(STRAPI_CONTYPE_URL, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
//     const data = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
//     return data;
// }

/**
 * Get attribute fields of given content type from strapi
 * @param {*} contentType 
 * @returns 
 */
 export const getFields = async (contentType) => {
    const url = `${strapiBaseUrl}/content-manager/collection-types/${contentType}`; //TODO use this through proxy 
    const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
        headers: {
            'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwNDQ5NjEyLCJleHAiOjE2NTMwNDE2MTJ9.6MiSNj9LIe5_jooQLAVflzPulWvOczBNKXQuLJCg1Zc'}`
        }
    });
    // const { data: { results } } = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    console.log("Result", results);
    const content = {};
    if (results && results.length) {
        const fieldsArr = Object.keys(results[0]);

        const obj = {}

        dummyData = results[0];
        // Type check TODO
        for (const One in dummyData) {
            if (Object.hasOwnProperty.call(dummyData, One)) {
                const element = dummyData[One];
                if (typeof dummyData[One] === 'object' && dummyData[One] !== null && !Array.isArray(dummyData[One])) { 
                    console.log('2', One, dummyData[One]);
                    // TODO Start
                    obj[One] = Object.keys(dummyData[One]);
                    // TODO End
                    for (const Two in dummyData[One]) {
                        console.log('3.0', dummyData[One][Two])

                        if (typeof dummyData[One][Two] === 'object' && dummyData[One][Two] !== null) {
                            // console.log('3',dummyData[One][Two])
                            for (const Three in dummyData[One][Two]) {
                                console.log('3.1', Three)
                            }
                        } else {
                            console.log('4',dummyData[One][Two])
                        }
                    }
                } else {
                    console.log('1', One, dummyData[One]);
                }
            }
        }

        fieldsArr.map((el) => {


            if (obj.hasOwnProperty(el)) {
                const arr = obj[el];
                console.log(arr[obj[el].length]);
                // console.log("ullu",obj[el], [obj[el].length]);
                content[el] = obj[el]
            } else {
                content[el + "}}"] = [
                    "getTextForLang(\"<LANG_CODE>\")",
                    "text",
                    "textMap(\"<LANG_CODE>\")"
                ]
            }

            // content[el + "}}"] = [
            //     "getTextForLang(\"<LANG_CODE>\")",
            //     "text",
            //     "textMap(\"<LANG_CODE>\")"
            // ]
        });
    }
    let contentObject = { 'content': content }
    return contentObject;
}

let dummyData = {}

export const getAttributes = async (contentType) => {
    const url = `${strapiBaseUrl}/content-manager/collection-types/${contentType}`; //TODO use this through proxy 
    const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
        headers: {
            'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwNDQ5NjEyLCJleHAiOjE2NTMwNDE2MTJ9.6MiSNj9LIe5_jooQLAVflzPulWvOczBNKXQuLJCg1Zc'}`
        }
    });
    // const { data: { results } } = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    const content = {};
    if (results && results.length) {
        const fieldsArr = Object.keys(results[0]);

        return fieldsArr;
    }
}