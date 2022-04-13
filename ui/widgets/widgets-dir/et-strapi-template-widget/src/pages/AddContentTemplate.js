import React, { Component } from 'react'
import ContentTemplateForm from '../components/ContentTemplateForm'

export default class AddContentTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
        data:{}, 
    }
    
}
 addTemplateHandler=(formData) =>{
  console.log("AddContentTemplate",formData);
  //Need to call API
}
  render() {
    return (
      <ContentTemplateForm addTemplateHandler={this.addTemplateHandler} />
    )
  }
}
