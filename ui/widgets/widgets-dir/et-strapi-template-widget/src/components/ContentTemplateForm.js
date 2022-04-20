import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import ModalUI from './ModalUI';
import AceEditor from 'react-ace';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/tomorrow';
import 'brace/snippets/html';
import 'brace/ext/language_tools';
import { Link } from 'react-router-dom';
import { addNewTemplate } from '../integration/Template';
import { getFields } from '../integration/StrapiAPI';
import {
    CANCEL_LABEL, DICTIONARY, DICTMAPPED, NOTIFICATION_OBJECT, NOTIFICATION_TIMER_ERROR,
    NOTIFICATION_TIMER_SUCCESS, NOTIFICATION_TYPE, SAVE_LABEL, SOMETHING_WENT_WRONG_MSG,
    TEMPLATE_CREATED_SUCCESSFULLY_MSG, FIELD_REQ, MAX50CHAR, ELE_TYPE
} from '../constant/constant';
import { getFilteredContentTypes } from '../helpers/helpers';
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const langTools = ace.acequire('ace/ext/language_tools');
const tokenUtils = ace.acequire('ace/autocomplete/util');
const { textCompleter, keyWordCompleter, snippetCompleter } = langTools;
const defaultCompleters = [textCompleter, keyWordCompleter, snippetCompleter];

const escChars = term => term.replace('$', '\\$').replace('#', '\\#');
const isAttribFunction = term => /[a-zA-Z]+\([^)]*\)(\.[^)]*\))?/g.test(term);

const createSuggestionItem = (key, namespace, lvl = 0, meta = '') => ({
  caption: key,
  value: key,
  score: 10000 + lvl,
  meta: meta || `${namespace} Object ${isAttribFunction(key) ? 'Method' : 'Property'}`,
});

const aceOnBlur = onBlur => (_event, editor) => {
    if (editor) {
        const value = editor.getValue();
        onBlur(value);
    }
};

class ContentTemplateForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            name: '',
            selectedContentType:[],
            editorCoding: '',
            contentTypes: [],
            styleSheet: '',
            modalShow: false,
            // obj:{}, 
            editor: null,
            dictionaryLoaded: false,
            dictionary: DICTIONARY,
            dictList: [],
            dictMapped: DICTMAPPED,
            contentTemplateCompleter: null,
            attributesList: [],
            errorObj: {
                name: {
                    message: '',
                    valid: false,
                },
                type: {
                    message: '',
                    valid: false,
                },
                editorCoding: {
                    message: '',
                    valid: false,
                },
                styleSheet: {
                    message: '',
                    valid: false,
                }
            },
            isFormValid: false
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeHeadChange = this.handleTypeHeadChange.bind(this);
        this.handleStyleSheetChange = this.handleStyleSheetChange.bind(this);
        this.handleEditorCodingChange = this.handleEditorCodingChange.bind(this);
    }

    componentDidMount = async () => {
        await this.getCollectionType();
    }

    /**
     * Get the collection types
     */
    getCollectionType = async () => {
        const contentList = await getFilteredContentTypes();
        if (contentList && contentList.length) {
            const refinedContentTypes = [];
            contentList.forEach(element => {
                refinedContentTypes.push({ label: element.info.displayName, uid: element.uid, attributes: element.attributes })
            });
            this.setState({ contentTypes: refinedContentTypes });
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        let notificationObj = NOTIFICATION_OBJECT;
        notificationObj.key = uuidv4();

        // this.props.addTemplateHandler(obj); TODO: for resuble case.
        let templateObject =
        {
            "collectionType": this.state.selectedContentType.length ? this.state.selectedContentType[0].label : '',
            "templateName": this.state.name ? this.state.name : '',
            "contentShape": this.state.editorCoding,
            // TODO: code
            "code": "News7777",
            "styleSheet": this.state.styleSheet
        }
        await addNewTemplate(templateObject).then((res) => {
            if (res.isError) {
                notificationObj.type = NOTIFICATION_TYPE.ERROR;
                if (res.errorBody && res.errorBody.response && res.errorBody.response.data && res.errorBody.response.data.errors && res.errorBody.response.data.errors.length) {
                    notificationObj.message = res.errorBody.response.data.errors.join(", ");
                } else {
                    notificationObj.message = SOMETHING_WENT_WRONG_MSG;
                }
                notificationObj.timerdelay = NOTIFICATION_TIMER_ERROR;
            } else {
                notificationObj.type = NOTIFICATION_TYPE.SUCCESS;
                notificationObj.message = TEMPLATE_CREATED_SUCCESSFULLY_MSG;
                notificationObj.timerdelay = NOTIFICATION_TIMER_SUCCESS;
                this.props.history.push('/'); // Navigate to Search screen
            }
            this.props.addNotification(notificationObj);
        });
    }

    /**
     * Get code and type fields of attributes
     */
    getAttributeData(uid) {
        let refinedAttributes = [];
        const filteredAttributes = this.state.contentTypes.filter((el) => el.uid === uid);
        for (let attr in filteredAttributes[0].attributes) {
            refinedAttributes.push({ [attr]: filteredAttributes[0].attributes[attr]['type'] });
        }
        this.setState({ attributesList: refinedAttributes })
    }

    handleNameChange(event) {
        const errObjTemp = this.state.errorObj;
        if (!event.target.value.length) {
            errObjTemp.name.message = FIELD_REQ;
            errObjTemp.name.valid = false;
        }
        if (event.target.value.length) {
            errObjTemp.name.message = '';
            errObjTemp.name.valid = true;
            this.setState({ isFormValid: true })
        }
        if (event.target.value.length > 50) {
            errObjTemp.name.message = MAX50CHAR;
            errObjTemp.name.valid = false;
            this.setState({ isFormValid: false })
        }
        this.setState({ name: event.target.value, errorObj: errObjTemp })
    }

    handleTypeHeadChange = async (selectedContentTypeObj) => {
        const errObjTemp = this.state.errorObj;
        if (selectedContentTypeObj.length) {
            errObjTemp.type.valid = true;
            errObjTemp.type.message = '';
            this.setState({ errorObj: errObjTemp })
            this.setState({ selectedContentType: selectedContentTypeObj }, async () => {
                this.getAttributeData(selectedContentTypeObj[0].uid);
                const dataForDictMap = await getFields(selectedContentTypeObj[0].uid);
                this.setState({ dictMapped: dataForDictMap });
            });
        } else {
            errObjTemp.type.valid = false;
            errObjTemp.type.message = FIELD_REQ;
            this.setState({ errorObj: errObjTemp })
            this.setState({ selectedContentType: selectedContentTypeObj });
        }
    }

    handleEditorCodingChange(value) {
        const errObjTemp = this.state.errorObj;
        if (!value.length) {
            errObjTemp.editorCoding.message = FIELD_REQ;
            errObjTemp.editorCoding.valid = false;
        }
        if (value.length) {
            errObjTemp.editorCoding.message = '';
            errObjTemp.editorCoding.valid = true;
        }
        this.setState({ editorCoding: value, errorObj: errObjTemp })
    }

    handleStyleSheetChange(event){
        this.setState({styleSheet: event.target.value});
    }

    modalHide = () => {
        this.setState({ modalShow: false });
    }

    onBlurHandler = (elementType) => {
        const errObjTemp = this.state.errorObj
        if (elementType === ELE_TYPE.NAME) {
            if (!this.state.name.length) {
                errObjTemp.name.valid = false;
                errObjTemp.name.message = FIELD_REQ;
            }
        }
        else if (elementType === ELE_TYPE.EDITORCODING) {
            if (!this.state.editorCoding.length) {
                errObjTemp.editorCoding.valid = false;
                errObjTemp.editorCoding.message = FIELD_REQ;
            }
        }
        else if (elementType === ELE_TYPE.TYPE) {
            if (!this.state.selectedContentType.length) {
                errObjTemp.type.valid = false;
                errObjTemp.type.message = FIELD_REQ;
            }
        }
        this.setState({ errorObj: errObjTemp })
    }

    // =================== START: Coding of React-Ace ============== 
    onEditorLoaded = (editor) => {
        this.setState({ editor });

        this.initCompleter();

        editor.commands.addCommand({
            name: 'dotCommandSubMethods',
            bindKey: { win: '.', mac: '.' },
            exec: () => {
                editor.insert('.');
                const { selection } = editor;
                const cursor = selection.getCursor();
                const extracted = this.extractCodeFromCursor(cursor);
                const { namespace } = extracted;
                if (!namespace) {
                    this.enableRootSuggestions();
                    return;
                }

                const [rootSpace, ...subSpace] = namespace.split('.');

                if (subSpace.length > 1) {
                    this.enableRootSuggestions();
                    return;
                }

                const verified = subSpace.length
                    ? this.findTokenInDictMap(subSpace[0], rootSpace)
                    : this.findTokenInDictMap(rootSpace);
                if (verified) {
                    this.disableRootSuggestions();
                } else {
                    this.enableRootSuggestions();
                }
                editor.execCommand('startAutocomplete');
            },
        });
    }

    initCompleter() {
        const contentTemplateCompleter = {
            getCompletions: (
                _editor,
                session,
                cursor,
                prefix,
                callback,
            ) => {
                const extracted = this.extractCodeFromCursor(cursor, prefix);
                const { namespace } = extracted;
                if (!namespace) {
                    this.enableRootSuggestions();
                } else {
                    const [rootSpace, ...subSpace] = namespace.split('.');

                    const verified = subSpace.length
                        ? this.findTokenInDictMap(subSpace[0], rootSpace)
                        : this.findTokenInDictMap(rootSpace);
                    if (verified) {
                        this.disableRootSuggestions();
                        const { dictMapped } = this.state;
                        if (verified.namespace) {
                            const mappedToken = dictMapped[verified.namespace];
                            const dictList = mappedToken[verified.term]
                                .map(entry => createSuggestionItem(entry, verified.namespace, 2));
                            this.setState({ dictList });
                        } else {
                            const mappedToken = dictMapped[verified.term];
                            const dictList = Object.entries(mappedToken)
                                .map(([entry]) => createSuggestionItem(entry, verified.term, 1));
                            this.setState({ dictList });
                        }
                    } else {
                        this.disableRootSuggestions();
                    }
                }

                const dictList = this.state.dictList;

                callback(null, dictList);
            },
        };

        langTools.setCompleters([...defaultCompleters, contentTemplateCompleter]);
        this.setState({ contentTemplateCompleter });
    }

    extractCodeFromCursor = ({ row, column }, prefixToken) => {
        const { editor: { session } } = this.state;
        const codeline = (session.getDocument().getLine(row)).trim();
        const token = prefixToken || tokenUtils.retrievePrecedingIdentifier(codeline, column);
        const wholeToken = tokenUtils.retrievePrecedingIdentifier(
            codeline,
            column,
            /[.a-zA-Z_0-9$\-\u00A2-\uFFFF]/,
        );
        if (token === wholeToken) {
            return { token, namespace: '' };
        }
        const namespace = wholeToken.replace(/\.$/g, '');
        return { token, namespace };
    }

    extractCodeFromCursor = ({ row, column }, prefixToken) => {
        const { editor: { session } } = this.state;
        const codeline = (session.getDocument().getLine(row)).trim();
        const token = prefixToken || tokenUtils.retrievePrecedingIdentifier(codeline, column);
        const wholeToken = tokenUtils.retrievePrecedingIdentifier(
            codeline,
            column,
            /[.a-zA-Z_0-9$\-\u00A2-\uFFFF]/,
        );
        if (token === wholeToken) {
            return { token, namespace: '' };
        }
        const namespace = wholeToken.replace(/\.$/g, '');
        return { token, namespace };
    }

    extractCodeFromCursor = ({ row, column }, prefixToken) => {
        const { editor: { session } } = this.state;
        const codeline = (session.getDocument().getLine(row)).trim();
        const token = prefixToken || tokenUtils.retrievePrecedingIdentifier(codeline, column);
        const wholeToken = tokenUtils.retrievePrecedingIdentifier(
            codeline,
            column,
            /[.a-zA-Z_0-9$\-\u00A2-\uFFFF]/,
        );
        if (token === wholeToken) {
            return { token, namespace: '' };
        }
        const namespace = wholeToken.replace(/\.$/g, '');
        return { token, namespace };
    }

    enableRootSuggestions = () => {
        const { dictionary, contentTemplateCompleter } = this.state;
        langTools.setCompleters([...defaultCompleters, contentTemplateCompleter]);
        this.setState({
            dictList: [...dictionary],
        });
    }

    findTokenInDictMap = (token, parentToken) => {
        const { dictMapped } = this.state;
        const findInDict = (term, dict) => (
            Object.keys(dict).find((key) => {
                const keyRegEx = new RegExp(`${escChars(key)}$`, 'g');
                return keyRegEx.test(term);
            })
        );
        if (!parentToken) {
            const term = findInDict(token, dictMapped);
            return term && { term };
        }
        const namespace = findInDict(parentToken, dictMapped);
        if (!namespace) {
            return false;
        }
        const term = findInDict(token, dictMapped[parentToken]);
        if (!term) return false;
        return { term, namespace };
    }

    disableRootSuggestions = () => {
        const { contentTemplateCompleter } = this.state;
        langTools.setCompleters([contentTemplateCompleter]);
    }
    // =================== END: Coding of React-Ace ==============

    render() {
        return (
            <div className="formContainer show-grid" style={{marginRight:"12vw", marginTop:"2vw"}}>
                <form onSubmit={this.handleSubmit}>
                    {/* kamlesh */}
                <div className="formContainer col-xs-12" align="right" style={{ marginBottom:"2vw"}}>
                            <div className="col-lg-10" style={{ textAlign: "end" }}>
                            </div>
                            <div className="col-lg-2">
                                <Link to="/">
                                    <button className="btn-default btn">{CANCEL_LABEL}</button>
                                </Link>
                                {/* <button className="btn-primary" type="submit" style={{ marginLeft: "1vw" }}>{SAVE_LABEL}</button> */}
                                <button className="btn-primary btn" type="submit" disabled={!(this.state.errorObj.name.valid && this.state.errorObj.editorCoding.valid && this.state.errorObj.type.valid)} style={{ marginLeft:"1vw"}}>{SAVE_LABEL}</button>
                                {/* <button className="btn-primary primary-btn mv-2 btn" type="submit" disabled={!(this.state.errorObj.name.valid && this.state.errorObj.editorCoding.valid && this.state.errorObj.type.valid)} style={{ marginLeft:"1vw"}}>{SAVE_LABEL}</button> */}
                            </div>
                        </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                            <label htmlFor="id" className="control-label">
                                <span className="FormLabel">
                                    <span>Type</span>
                                    {/* <sup>
                                        <i className="fa fa-asterisk required-icon FormLabel__required-icon"></i>
                                    </sup>
                                    <button type="button" className="btn btn-link">
                                        <span aria-hidden="true" className="pficon pficon-info"></span>
                                    </button> */}
                                </span>
                            </label>
                        </div>
                        <div className={`col-lg-10`}>
                            <Typeahead
                                id="basic-typeahead-multiple"
                                onChange={this.handleTypeHeadChange}
                                options={this.state.contentTypes}
                                placeholder="Choose..."
                                selected={this.state.selectedContentType}
                                className={this.state.errorObj.type.message && 'has-error'}
                                onBlur={()=>this.onBlurHandler(ELE_TYPE.TYPE)}
                            />
                        </div>
                        <div className="col-lg-2">
                        </div>
                        <div className="col-lg-10">
                            {this.state.errorObj.type.message &&
                                <span className="validation-block">
                                    <span>{this.state.errorObj.type.message}</span>
                                </span>
                            }
                        </div>
                    </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                            <label htmlFor="id" className="control-label">
                                <span className="FormLabel">
                                    <span>Name</span>
                                    {/* <sup>
                                    <i className="fa fa-asterisk required-icon FormLabel__required-icon"></i>
                                </sup>
                                <button type="button" className="btn btn-link">
                                    <span aria-hidden="true" className="pficon pficon-info"></span>
                                </button> */}
                                </span>
                            </label>
                        </div>
                        <div className={`col-lg-10 ${this.state.errorObj.name.message && 'has-error'}`}>
                            <input
                                name="id"
                                type="text"
                                id="id"
                                placeholder=""
                                className="form-control RenderTextInput"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                                onBlur={()=>this.onBlurHandler(ELE_TYPE.NAME)}
                            />
                        </div>
                        <div className="col-lg-2">
                        </div>
                        <div className="col-lg-10">
                            {this.state.errorObj.name.message &&
                                <span className="validation-block">
                                    <span>{this.state.errorObj.name.message}</span>
                                </span>
                            }
                        </div>
                    </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                            <label htmlFor="id" className="control-label">
                                <span className="FormLabel">
                                    <span>Attributes</span>
                                </span>
                            </label>
                        </div>
                        <div className="col-lg-10">
                            <table className="table dataTable table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Type</th>
                                        {/* TODO: Hided Roles for time being. */}
                                        {/* <th>Roles</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.attributesList.map(el => (
                                    <tr key={Object.keys(el)[0]}>
                                        <td>{Object.keys(el)[0]}</td>
                                        <td>{el[Object.keys(el)[0]]}</td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                            <label htmlFor="id" className="control-label">
                                <span className="FormLabel">
                                    <span>Model</span>
                                </span>
                            </label>
                        </div>
                        <div className="col-lg-10">
                            <button type="button" onClick={() => this.setState({ modalShow: true })} className="btn btn-success">Inline editing assistant</button>
                        </div>
                    </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                        </div>
                        <div className="col-lg-10">
                            <AceEditor
                                mode="html"
                                theme="tomorrow"
                                width="100%"
                                showPrintMargin={false}
                                editorProps={{
                                    $blockScrolling: Infinity,
                                }}
                                setOptions={{
                                    useWorker: false,
                                }}
                                enableBasicAutocompletion
                                enableLiveAutocompletion
                                enableSnippets
                                name="UNIQUE_ID_OF_DIV"
                                onChange={this.handleEditorCodingChange}
                                onLoad={this.onEditorLoaded}
                                value={this.state.editorCoding}
                                style={{borderStyle:"solid",borderColor:"silver",borderWidth:"thin"}}
                                onBlur={()=>this.onBlurHandler(ELE_TYPE.EDITORCODING)}
                            />
                        </div>

                        <div className="col-lg-2">
                    </div>
                    <div className="col-lg-10">
                        <span>(press ctrl + space to open content assist menu)</span>
                    </div>

                    <div className="col-lg-2">
                    </div>
                    <div className="col-lg-10">
                        {this.state.errorObj.editorCoding.message &&
                            <span className="validation-block">
                                <span>{this.state.errorObj.editorCoding.message}</span>
                            </span>
                        }
                    </div>
                    </div>
                    <div className="formContainer col-xs-12 form-group">
                        <div className="col-lg-2" style={{ textAlign: "end" }}>
                            <label htmlFor="id" className="control-label">
                                <span className="FormLabel">
                                    <span>Style Sheet</span>
                                    {/* <sup>
                                    <i className="fa fa-asterisk required-icon FormLabel__required-icon"></i>
                                </sup>
                                <button type="button" className="btn btn-link">
                                    <span aria-hidden="true" className="pficon pficon-info"></span>
                                </button> */}
                                </span>
                            </label>
                        </div>
                        <div className="col-lg-10">
                            <input
                                name="id"
                                type="text"
                                id="id"
                                placeholder=""
                                className="form-control RenderTextInput"
                                value={this.state.styleSheet}
                                onChange={this.handleStyleSheetChange}
                            />
                        </div>
                    <div className="col-lg-2">
                    </div>
                    <div className="col-lg-10">
                        {this.state.errorObj.styleSheet.message &&
                            <span className="validation-block">
                                <span>{this.state.errorObj.styleSheet.message}</span>
                            </span>
                        }
                    </div>
                    </div>

                </form>
                
                <ModalUI modalShow={this.state.modalShow} modalHide={this.modalHide} title={"Inline editing assistant"}>
                    <span>
                        Provides an example on how to activate <strong>INLINE EDITING</strong> for Entando labels<br /><br />
                        <ol>
                            <li> Open a <strong>TAG</strong> like div p span... </li>
                            <li> add the class <strong>'editContent'</strong> to the TAG. Keep in mind that <strong>'editContentText'</strong> class can be used in case of a text-area. </li>
                            <li>then add <strong>data-content-id="$content.getId()"</strong> </li>
                            <li>then add the attribute ID (TITLE) of the desidered label adding <strong>data-attr-id="TITLE"</strong> and close the tag with &gt;. Please be careful when writing the attribute ID as it is <strong>case sensitive</strong> and it must match the label attribute in the next step </li>
                            <li>finally add the label of the desidered attribute that will be rendered on screen writing <strong>$content.TITLE.text</strong>.</li>
                            <li>Close the <strong>TAG</strong> (div p span ...) opened at the very beginning.</li>
                        </ol>
                        Result should look like this:<br /><br /> OPEN TAG class="editContent" data-content-id="$content.getId()" data-attr-id="TITLE"&gt;<br />$content.TITLE.text<br />CLOSE TAG
                    </span>
                </ModalUI>
            </div>
        )
    }
}

export default withRouter(ContentTemplateForm);
