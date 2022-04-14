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
import { addNewTemplate, getCollectionTypes } from '../integration/Template';
import { getFields, getFieldsTwo } from '../integration/StrapiAPI';
import { DICTIONARY, DICTMAPPED } from '../constant/constant';

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

export default class ContentTemplateForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            name: '',
            selectedContentType:[],
            contentTypeProgram: '',
            collectionTypes: [],
            styleSheet: '',
            modalShow: false,
            obj:{}, 
            editor: null,
            dictionaryLoaded: false,
            dictionary: DICTIONARY,
            dictList: [],
            dictMapped: DICTMAPPED,
            contentTemplateCompleter: null,
            attributesList: []
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeaheadChangeContentType = this.handleTypeaheadChangeContentType.bind(this);
        this.handleStyleChange = this.handleStyleChange.bind(this);
        this.handleContentTypeProgram = this.handleContentTypeProgram.bind(this);
    }

    componentDidMount = async () => {
        await this.getCollectionType();
    }

    getCollectionType = async () => {
        const { data: { data } } = await getCollectionTypes();
        if (data && data.length) {
            this.getDataTypeOfAttribute(data);
            const collectionListData = data.filter((el) => {
            if (el.uid.startsWith('api::')) {
                return el.apiID;
            }
            });
            const contentTypeRefine = [];
            collectionListData.length && collectionListData.forEach(element => {
                contentTypeRefine.push({ label: element.info.pluralName })
            });
            const fieldsData = await getFields(contentTypeRefine[0].label.slice(contentTypeRefine[0].label, contentTypeRefine[0].label.length - 1));
            this.setState({ dictMapped: fieldsData })
            this.setState({ collectionTypes: contentTypeRefine });
        }
    }

    handleSubmit = async (event) => {
        let obj = 
        {
            "collectionType": this.state.selectedContentType[0].label,
            "templateName": this.state.name,
            "contentShape": this.state.contentTypeProgram,
            "code": "News7777",
            "styleSheet": this.state.styleSheet
        }
        this.props.addTemplateHandler(obj);
        event.preventDefault();
        // // API Call
        // const data = {
        //     code: this.state.code,
        //     templateName: this.state.name,
        //     collectionType: this.state.contentType[0],
        //     contentShape: this.state.contentTypeProgram,
        // }
        // await postTemplate(data).then((res) => {
        //     this.props.history.push('/')
        // });
        await addNewTemplate(obj).then((res) => {
                console.log(res);
            });
    }

    getDataTypeOfAttribute(data) {
        data.map(el => {
            if (el.uid.startsWith('api::')) {
                let refine = [];
                for (let attr in el.attributes) {
                    refine.push({ [attr]: el.attributes[attr]['type'] });
                }
                this.setState({attributesList: refine})
            }
        });
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value })
        
    }

    handleTypeaheadChangeContentType = async (selectedContentType) => {
        if (selectedContentType.length) {
            const data = await getFields(selectedContentType[0].label.slice(0, selectedContentType[0].label.length - 1));
            this.setState({ dictMapped: data })
        }
        this.setState({ selectedContentType: selectedContentType });
    }

    handleContentTypeProgram(value){
        this.setState({contentTypeProgram: value})
    }

    handleStyleChange(event){
        this.setState({styleSheet: event.target.value});
    }

    modalHide = () => {
        this.setState({ modalShow: false });
    }

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

    render() { 
        return (
            <div className="formContainer show-grid" style={{marginRight:"12vw"}}>
                <form onSubmit={this.handleSubmit}>
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
                        <div className="col-lg-10">
                            <Typeahead
                                id="basic-typeahead-multiple"
                                onChange={this.handleTypeaheadChangeContentType}
                                options={this.state.collectionTypes}
                                // options={[{ label: 'Banner' }, { label: 'News' }, { label: '2 columns' }]}
                                placeholder="Choose..."
                                selected={this.state.selectedContentType}
                            />
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
                        <div className="col-lg-10">
                            <input
                                name="id"
                                type="text"
                                id="id"
                                placeholder=""
                                className="form-control RenderTextInput"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />
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
                                    {this.state.attributesList.map(el => (<tr><td>{Object.keys(el)[0]}</td><td>{el[Object.keys(el)[0]]}</td></tr>))}
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
                                onChange={this.handleContentTypeProgram}
                                onLoad={this.onEditorLoaded}
                                value={this.state.contentTypeProgram}
                                style={{borderStyle:"solid",borderColor:"silver",borderWidth:"thin"}}
                            />
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
                                onChange={this.handleStyleChange}
                            />
                        </div>
                    </div>
                    <div className="formContainer col-xs-12">
                            <div className="col-lg-10" style={{ textAlign: "end" }}>
                            </div>
                            <div className="col-lg-2">
                                <Link to="/">
                                    <button className="default-btn">Cancel</button>
                                </Link>
                                <button className="default-btn" type="submit">Save</button>
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
