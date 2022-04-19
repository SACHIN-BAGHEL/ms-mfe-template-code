import axios from "axios";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwMDE2NjExLCJleHAiOjE2NTI2MDg2MTF9.XDYt_wv0DmQyjriAATWnYywBiZd8Ml89GSJnA3yme1E'
export const getFields = async (contentType) => {
    let url = `http://localhost:1337/content-manager/collection-types/${contentType}`;
    const { data: { results } } = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

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

// todo make this method more generic or use the generic method like template declare url in env || const file.
const strapiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwMDE2NjExLCJleHAiOjE2NTI2MDg2MTF9.XDYt_wv0DmQyjriAATWnYywBiZd8Ml89GSJnA3yme1E';

/**
 * Get strapi content types
 * @returns 
 */
export const getStrapiContentTypes = async () => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`, {
        headers: {
            'Authorization': `Bearer ${strapiToken}`
        }
    });
    return data;
}

// export const getStrapiContentTypes = async () => {
//     const data = await axios.get(`http://localhost:1337/content-manager/content-types`, addAuthorizationRequestConfig({}, 'EntKcToken'));
//     return data;
// }
