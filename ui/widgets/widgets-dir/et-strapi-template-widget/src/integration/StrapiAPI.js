import axios from "axios";
import { KC_TOKEN_PREFIX, PAGE, STRAPI_COLTYPE_URL } from "../constant/constant";
import { addAuthorizationRequestConfig } from "./Integration";

const strapiBaseUrl = `${process.env.REACT_APP_STRAPI_API_URL}`;
const token = {
    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUxNDg0MjExLCJleHAiOjE2NTQwNzYyMTF9.HHLzqCfhuyNn0bfXtBOxWRVctMKrQuRkaDul9xerqFs'}`
};

/*********************
 * Strapi COLLECTION TYPE
 *********************/

/**
 * Get strapi content types
 * @returns 
 */
// TODO: Remove commentted code later
// export const getStrapiContentTypes = async () => {
//     const data = await axios.get(`${strapiBaseUrl}/content-manager/content-types`, {
//         headers: token
//     });
//     return data;
// }

/**
 * Get strapi content types
 * @returns 
 */
// TODO: TEST ENV START
// export const getStrapiContentTypes = async () => {
//     const url = `${strapiBaseUrl}/content-manager/content-types`;
//     // const data = await axios.get(STRAPI_CONTYPE_URL, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
//     const data = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
//     return data;
// }
// TODO: TEST ENV END

// TODO: Vijay ENV START
export const getStrapiContentTypes = async () => {
    const url = `${strapiBaseUrl}/content-manager/content-types`;
    const data = await axios.get(url, {
        headers: token
    });
    return data;
}
// TODO: VIJAY ENV END
/**
 * Get attribute fields of given content type from strapi
 * @param {*} contentType 
 * @returns 
 */
 export const getFields = async (contentType) => {
    // TODO: TEST ENV START
    // const url = `${strapiBaseUrl}/content-manager/collection-types/${contentType}`; //TODO use this through proxy 
    // // const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
    // //     headers: {
    // //         'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwNDQ5NjEyLCJleHAiOjE2NTMwNDE2MTJ9.6MiSNj9LIe5_jooQLAVflzPulWvOczBNKXQuLJCg1Zc'}`
    // //     }
    // // });
    // const { data: { results } } = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    // TODO: TEST ENV END

    // TODO: VIJAY ENV START
    let { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
        headers: token
    });
    // TODO: VIJAY ENV END
    const getContentTypeObj = await getContentTypes(contentType.split('.')[contentType.split('.').length - 1]);

    const content = {};
    if (results && results.length) {
        // const fieldsArr = Object.keys(results[0]);
        const fieldsArr = Object.keys(getContentTypeObj);

        const obj = {}

        // dummyData = results[0];
        dummyData = getContentTypeObj;
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
                content[el] = arr;
            } else {
                content[el] = [
                    "getTextForLang(\"<LANG_CODE>\")",
                    "text",
                    "textMap(\"<LANG_CODE>\")"
                ]
            }

        });
    }
    let contentObject = { '$content': content }
    return contentObject;
}

let dummyData = {}

export const getAttributes = async (contentType) => {
    // TODO: TEST ENV START
    // const url = `${strapiBaseUrl}/content-manager/collection-types/${contentType}`; //TODO use this through proxy 
    // // const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
    // //     headers: {
    // //         'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwNDQ5NjEyLCJleHAiOjE2NTMwNDE2MTJ9.6MiSNj9LIe5_jooQLAVflzPulWvOczBNKXQuLJCg1Zc'}`
    // //     }
    // // });
    // const { data: { results } } = await axios.get(url, addAuthorizationRequestConfig({}, KC_TOKEN_PREFIX));
    // TODO: TEST ENV END

    // TODO: VIJAY ENV START
    const { data: { results } } = await axios.get(`${STRAPI_COLTYPE_URL}${contentType}`, {
        headers: token
    });
    // TODO: VIJAY ENV END
    const content = {};
    if (results && results.length) {
        const fieldsArr = Object.keys(results[0]);

        return fieldsArr;
    }
}


// Mapping with content-types with components
export const getContentTypes = async (conType) => {
    const { data: { data: contentTypesList } } = await axios.get(`${strapiBaseUrl}/content-type-builder/content-types`, {
        headers: token
    });
    const filteredContentType = contentTypesList.filter(el => el.uid.startsWith('api::'));

    const { data: { data: componentsList } } = await axios.get(`${strapiBaseUrl}/content-type-builder/components`, {
        headers: token
    });

    if (contentTypesList.length) {
        filteredContentType.map(el => {
            for (const key in el.schema.attributes) {
                if (Object.hasOwnProperty.call(el.schema.attributes, key)) {
                    const element = el.schema.attributes[key];
                    if (isTypeComponent(element, componentsList)) {
                        const filtered = filterBy(componentsList, element)
                        el.schema.attributes[key] = filtered[0].schema.attributes;
                        for (const pointer in filtered[0].schema.attributes) {
                            if (Object.hasOwnProperty.call(filtered[0].schema.attributes, pointer)) {
                                const elementTwo = filtered[0].schema.attributes[pointer];
                                if (isTypeComponent(elementTwo, componentsList)) {
                                    const filteredTwo = filterBy(componentsList, elementTwo);
                                    el.schema.attributes[key][pointer] = filteredTwo[0].schema.attributes;
                                }
                            }
                        }
                    } else if (isTypeDynamiczone(element, componentsList)) {
                        el.schema.attributes[key].type = 'array';
                    }
                }
            }
        })
    } else {
        console.error('Something Went Wrong');
    }
    let filterListByConType = filteredContentType.filter(el => {
        if (el.uid.split('.')[el.uid.split('.').length - 1] === conType) {
            return el;
        }
    });
    return filterListByConType[0].schema.attributes;
}

function isTypeComponent(element, componentsList) {
    return element.type === 'component' && componentsList.length;
}

function isTypeDynamiczone(element, componentsList) {
    return element.type === 'dynamiczone' && componentsList.length;
}

function filterBy(componentsList, element) {
    return (
        componentsList.filter(el => element.component.split('.')[element.component.split('.').length - 1] === el.uid.split('.')[el.uid.split('.').length - 1])
    );
}
