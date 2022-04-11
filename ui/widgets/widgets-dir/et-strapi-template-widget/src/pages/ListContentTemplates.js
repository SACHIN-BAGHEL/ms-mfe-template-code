import React, { Component } from 'react'
import TemplateDataTable from '../components/TemplateDataTable'
import TemplateSearch from '../components/TemplateSearch'

export default class ListContentTemplates extends Component {
    render() {
        return (
            <>
                <TemplateSearch />
                <TemplateDataTable />
            </>
        )
    }
}
