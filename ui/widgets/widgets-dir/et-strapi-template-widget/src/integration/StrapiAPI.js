import axios from "axios";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5OTM1NjE2LCJleHAiOjE2NTI1Mjc2MTZ9.Xa6_GcudV2JoyeKzm2r2uvCs23FnkOlPA53Drqmlnec'
export const getFields = async (contentType) => {
    // const contentType = 'project'
    // let url = `http://localhost:1337/content-manager/collection-types/api::${contentType}.${contentType}?page=1&pageSize=10&sort=Title:ASC`;
    let url = `http://localhost:1337/content-manager/collection-types/api::${contentType}.${contentType}?page=1&pageSize=10`;
    console.log('url: ', url);
    const { data: { results } } = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log('results: ', results);
    const content = {};
    if(results && results.length) {
        const fieldsArr = Object.keys(results[0]);
        
        fieldsArr.map((el) => {
            content[el + "}}"] = [
                "getTextForLang(\"<LANG_CODE>\")",
                "text",
                "textMap(\"<LANG_CODE>\")"
            ]
            console.log('EL', el)
        });
    }
    let contentObject = { 'content': content }
    console.log("contentObject",contentObject);
    return contentObject;
}

export const getFieldsTwo = async (contentType) => {
    // const contentType = 'project'
    const { data } = await axios.get(`http://localhost:1337/content-manager/collection-types/api::${contentType}.${contentType}?page=1&pageSize=10&sort=Title:ASC`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return data;
}