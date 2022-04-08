import axios from "axios";

export const getData = async (url, id) => {
    url = mergeUrl(url, id)

    const data = await axios
        .get(url)
        .then((res) => {
            return res.data
        })
        .catch((e) => {
            return e
        })

    return errorCheck(data)
}

// if an ID is present, it modifies the url by merging it with the ID
const mergeUrl = (url, id) => {
    if (id) {
        url = `${url}${id}`
    }

    return url
}


// checks if the input data is an error and returns the data enhanced with a boolean
const errorCheck = (data) => {
    let isError = false

    if (data.hasOwnProperty("toJSON") && data.toJSON().name === "Error") {
        isError = true
    }

    return {
        data,
        isError,
    }
}