import React, { Component } from 'react'
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ListContentTemplates from './pages/ListContentTemplates';
import AddContentTemplate from './pages/AddContentTemplate';
import EditContentTemplate from './pages/EditContentTemplate';
import './App.css';
import { TimedToastNotification, ToastNotificationList } from 'patternfly-react';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList : []
    }
  }

  addNotification = (notificationObj) => {
    const allnote = this.state.notificationList;
    allnote.push(notificationObj);
    this.setState({notificationList: allnote});
  }

  removeNotification = (notId) => {
    const filterNotes = this.state.notificationList.filter(el => el.key !== notId);
    this.setState({notificationList: filterNotes})
  }

  render() {
    return (
      <div>
        <ToastNotificationList>
          {
            this.state.notificationList.map(el => {
              return (
                <TimedToastNotification
                  key={el.key}
                  type={el.type}
                  persistent={false}
                  onDismiss={() => this.removeNotification(el.key)}
                  timerdelay={el.timerdelay}
                >
                  <span>
                    {el.message}
                  </span>
                </TimedToastNotification>
              )
            })
          }
        </ToastNotificationList>
        <BrowserRouter>
          <Route path="/" exact><ListContentTemplates addNotification={this.addNotification} /></Route>
          <Route path="/add-template" exact><AddContentTemplate addNotification={this.addNotification} /></Route>
          <Route path="/edit-template/:templateId" exact><EditContentTemplate addNotification={this.addNotification} /></Route>
        </BrowserRouter>
      </div>
    )
  }
}
