import React, { Component } from 'react'
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ListContentTemplates from './pages/ListContentTemplates';
import AddContentTemplate from './pages/AddContentTemplate';
import EditContentTemplate from './pages/EditContentTemplate';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Route path="/" exact><ListContentTemplates /></Route>
          <Route path="/add-template" exact><AddContentTemplate /></Route>
          <Route path="/edit-template/:templateId" exact><EditContentTemplate /></Route>
        </BrowserRouter>
      </div>
    )
  }
}
