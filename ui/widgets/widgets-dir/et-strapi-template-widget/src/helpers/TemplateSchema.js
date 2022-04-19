import * as Yup from "yup";
import { EDITORCODINGREQ, MAX25CHAR, MIN3CHAR, NAMEREQ, TYPE_REQ } from "../constant/constant";

export const templateSchema = Yup.object().shape({
    templateName: Yup.string()
        .min(3, MIN3CHAR)
        .max(25, MAX25CHAR)
        .required(NAMEREQ),
    contentShape: Yup.string()
        .min(3, MIN3CHAR)
        .required(EDITORCODINGREQ),
    collectionType: Yup.string()
        .required(TYPE_REQ),
    styleSheet: Yup.string(),
});

/**
 * selectedContentType
 * name
 * editorCoding
 * styleSheet
 */

/**
 * collectionType
templateName
contentShape
styleSheet
 */