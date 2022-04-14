import axios from "axios";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ4NDQxMjUwLCJleHAiOjE2NTEwMzMyNTB9.azaYPs05KQR_vkCltU3onTqhSWOuCpMvwaAt4VAcKTg'
export const getFields = async (contentType) => {
    // const contentType = 'project'
    const { data: { results } } = await axios.get(`http://localhost:1337/content-manager/collection-types/api::${contentType}.${contentType}?page=1&pageSize=10&sort=Title:ASC`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const fieldsArr = Object.keys(results[0]);
    const content = {};
    fieldsArr.map((el) => {
        content[el + "}}"] = [
            "getTextForLang(\"<LANG_CODE>\")",
            "text",
            "textMap(\"<LANG_CODE>\")"
        ]
        console.log('EL', el)
    })
    let timepass = { 'content': content }
    console.log("TIMEPASS",timepass)
    return timepass;
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