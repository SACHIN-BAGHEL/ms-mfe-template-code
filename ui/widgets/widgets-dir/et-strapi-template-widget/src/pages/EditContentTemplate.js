import React, { Component } from 'react'
import EditContentTemplateForm from '../components/EditContentTemplateForm'

export default class EditContentTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:{},
        }
    }

    editTemplateHandler=(formData) =>{
        console.log("editContentTemplate",formData);
        //Need to call API
      }

    render() {
        return (
            <EditContentTemplateForm editTemplateHandler={this.editTemplateHandler} />
        )
    }
}
