import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import ModalUI from './ModalUI';
import AceEditor from 'react-ace';

export default class ContentTemplateForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            name: '',
            contentType: [],
            contentTypeProgram: '',
            collectionTypes: [],
            modalShow: false,
        }
    }

    handleSubmit = async (event) => {
        // console.table(this.state);
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
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value })
    }

    modalHide = () => {
        this.setState({ modalShow: false });
    }

    render() {
        return (
            <div className="formContainer show-grid">
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
                                selected={this.state.contentType}
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
                                        <th>Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>question</td>
                                        <td>Hypertext</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>answer</td>
                                        <td>Hypertext</td>
                                        <td>-</td>
                                    </tr>
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
                                width="100%"
                                showPrintMargin={false}
                                mode="javascript"
                                theme="github"
                                onChange={this.handleContentTypeProgram}
                                name="UNIQUE_ID_OF_DIV"
                                editorProps={{ $blockScrolling: true }}
                                value={this.state.contentTypeProgram}
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
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />
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
