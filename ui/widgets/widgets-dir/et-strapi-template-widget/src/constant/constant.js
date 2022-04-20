/*********************
 * Pagination ********
 *********************/

export const PERPAGEOPTIONS = [5, 10, 15, 25, 50];
export const PAGE= 1;
export const PAGESIZE= 5;
export const TOTALITEMS= 20;
export const LASTPAGE= 4;
export const PAGEINPUT= 1;
export const PAGECHANGEVALUE= 1;

/*********************
 * Messages **********
 *********************/

export const NO_TEMPLATE_FOUND = "No template found.";
export const DEL_TEMPLATE_CONFIRM_MSG = 'Do you really want to delete ?';
export const TEMPLATE_CREATED_SUCCESSFULLY_MSG = 'Template created successfully';
export const SOMETHING_WENT_WRONG_MSG = 'Something went wrong, please try again.'
export const TEMPLATE_UPDATED_MSG = 'Template updated successfully';

export const ADD_LABEL = 'Add';
export const DELETE_LABEL = 'Delete';
export const EDIT_LABEL = 'Edit';
export const CLOSE_LABEL = 'Close';
export const CANCEL_LABEL = 'Cancel';
export const SAVE_LABEL = 'Save';

/*********************
 * Error Messages ****
 *********************/
export const MIN3CHAR = "Min 3 Char";
export const MAX25CHAR = "Max 3 Char";
export const NAMEREQ = "Name Required";
export const EDITORCODINGREQ = "Editor Coding Required";
export const TYPE_REQ = "Type required";
export const FIELD_REQ = "It is a mandatory field";
export const MAX50CHAR = "Must be 50 characters or less";

export const ELE_TYPE = {
    NAME: "name",
    EDITORCODING: "editorCoding",
    TYPE: "type"
}

export const TOASTER_POSITION = { }

/*********************
 * Editor Vars *******
 *********************/

export const DICTIONARY = [
    {
        "caption": "content",
        "value": "{{content",
        "score": 10000,
        "meta": "content Object"
    },
    {
        "caption": "$i18n",
        "value": "$i18n",
        "score": 10000,
        "meta": "$i18n Object"
    },
    {
        "caption": "$info",
        "value": "$info",
        "score": 10000,
        "meta": "$info Object"
    },
    {
        "caption": "#if (<TRUE>) <DO> #else <DOANOTHER> #end",
        "value": "#if (<TRUE>) <DO> #else <DOANOTHER> #end",
        "score": 10000,
        "meta": "#if (<TRUE>) <DO> #else <DOANOTHER> #end Object"
    },
    {
        "caption": "#if (<TRUE>) <DO> #end",
        "value": "#if (<TRUE>) <DO> #end",
        "score": 10000,
        "meta": "#if (<TRUE>) <DO> #end Object"
    },
    {
        "caption": "#set ($<VAR> = <VALUE>)",
        "value": "#set ($<VAR> = <VALUE>)",
        "score": 10000,
        "meta": "#set ($<VAR> = <VALUE>) Object"
    },
    {
        "caption": "#foreach ($item in $<LIST>) $item #end",
        "value": "#foreach ($item in $<LIST>) $item #end",
        "score": 10000,
        "meta": "#foreach ($item in $<LIST>) $item #end Object"
    }
]

export const DICTMAPPED = {
    "$content": {
        "title": [
            "getTextForLang(\"<LANG_CODE>\")",
            "text",
            "textMap(\"<LANG_CODE>\")"
        ],
        "abstract": [
            "getHead(<VALUE>)",
            "getHeadEscaped(VALUE)",
            "getTextAfterImage(<PERCENT_VALUE>)",
            "getTextBeforeImage(<PERCENT_VALUE>)",
            "getTextByRange(<START_PERCENT_VALUE>, <END_PERCENT_VALUE>)",
            "getTextForLang(\"<LANG_CODE>\")",
            "text",
            "textMap(\"<LANG_CODE>\")"
        ],
        "link": [
            "destination",
            "getTextForLang(\"<LANG_CODE>\")",
            "symbolicLink",
            "text",
            "textMap[\"<LANG_CODE>\"]"
        ],
        "image": [
            "getImagePath(<SIZE_ID>)",
            "getMetadata(\"<METADATA_CODE>\")",
            "getMetadataForLang(\"<METADATA_CODE>\", \"<LANG_CODE>\")",
            "getResource(\"<LANG_CODE>\")",
            "getResourceAltForLang(\"<LANG_CODE>\")",
            "getResourceDescriptionForLang(\"<LANG_CODE>\")",
            "getResourceLegendForLang(\"<LANG_CODE>\")",
            "getResourceTitleForLang(\"<LANG_CODE>\")",
            "getTextForLang(\"<LANG_CODE>\")",
            "resource",
            "resourceAlt",
            "resourceAltMap[\"<LANG_CODE>\"]",
            "resourceDescription",
            "resourceDescriptionMap[\"<LANG_CODE>\"]",
            "resourceLegend",
            "resourceLegendMap[\"<LANG_CODE>\"]",
            "resourceTitle",
            "resourceTitleMap[\"<LANG_CODE>\"]",
            "text",
            "textMap[\"<LANG_CODE>\"]"
        ],
        "placement": [
            "text"
        ],
        "getId()": null,
        "getCategories()": null,
        "getContentLink()": null,
        "getCreated('<DATE_PATTERN>')": null,
        "isUserAllowed('<PERMISSION_NAME>')": null,
        "getLastEditor()": null,
        "getContentOnPageLink('<PAGE_CODE>')": null,
        "getNonce()": null,
        "getLastModified('<DATE_PATTERN>')": null,
        "getVersion()": null,
        "getLangCode()": null
    },
    "$i18n": {
        "getLabelWithParams('<LABEL_CODE>').addParam('<PARAM_KEY>', '<PARAM_VALUE>')": null,
        "getLabel('<LABEL_CODE>')": null
    },
    "$info": {
        "getCurrentLang()": null,
        "getCurrentPage()": null,
        "getCurrentWidget()": null,
        "getConfigParameter('<PARAM_NAME>')": null
    },
    "#if (<TRUE>) <DO> #else <DOANOTHER> #end": {},
    "#if (<TRUE>) <DO> #end": {},
    "#set ($<VAR> = <VALUE>)": {},
    "#foreach ($item in $<LIST>) $item #end": {}
}

export const NOTIFICATION_TYPE =  {
    SUCCESS: 'success',
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info'
}

export const NOTIFICATION_TIMER_SUCCESS =  3000 //millisecond
export const NOTIFICATION_TIMER_ERROR =  8000 //millisecond

export const NOTIFICATION_OBJECT =  {
    key: 1,
    type: '',
    persistent: false,
    timerdelay: NOTIFICATION_TIMER_SUCCESS,
    message: ''
}

export const KC_TOKEN_PREFIX = 'EntKcToken';
export const STRAPI_CONTYPE_URL = 'http://localhost:1337/content-manager/content-types';
export const STRAPI_COLTYPE_URL = 'http://localhost:1337/content-manager/collection-types/';