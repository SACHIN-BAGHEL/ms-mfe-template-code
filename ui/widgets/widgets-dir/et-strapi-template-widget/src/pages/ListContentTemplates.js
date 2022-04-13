import React, { Component } from 'react'
import TemplateDataTable from '../components/TemplateDataTable'
import TemplateSearch from '../components/TemplateSearch'

export default class ListContentTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCollectionType: "All"
        };
    }

    collectionTypeOnChange = (selectedCollectionType) => this.setState({selectedCollectionType});

    render() {
        return (
            <>
                <TemplateSearch collectionTypeOnChange={this.collectionTypeOnChange} />
                <TemplateDataTable selectedCollectionType={this.state.selectedCollectionType}/>
            </>
        )
    }
}
