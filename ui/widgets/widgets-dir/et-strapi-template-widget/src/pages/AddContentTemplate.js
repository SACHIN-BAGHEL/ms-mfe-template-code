import React, { Component } from 'react'
import ContentTemplateForm from '../components/ContentTemplateForm';
import { TimedToastNotification} from 'patternfly-react';
import { TOASTER_POSITION } from '../constant/constant';

export default class AddContentTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
        data:{},
        notifications: []
    }

    this.removeNotificationAction = notificationToRemove => {
      this.setState({
          notifications: this.state.notifications.filter(notification => notificationToRemove.key !== notification.key)
      });
  };

  this.showNotification = this.showNotification.bind(this)
 }

 showNotification = (notificationToAdd) => {
  this.state.notifications.push(notificationToAdd);
  this.setState({
      notifications: this.state.notifications
  });
 }

 addTemplateHandler=(formData) => {
  console.log("AddContentTemplate",formData);
  //Need to call API
 }

 render() {
    return (
      <div>
        {/* ------ Show Notifications ------- */}
        <div id="1" style={TOASTER_POSITION}>
                {this.state.notifications.map(notification => (
                <TimedToastNotification
                  key={notification.key}
                  type={notification.type}
                  persistent={false}
                  onDismiss={() => this.removeNotificationAction(notification)}
                  timerdelay={notification.timerdelay}
                >
                <span>
                    {notification.header && <strong>{notification.header}<br></br></strong>}
                    {notification.message}
                </span>
                </TimedToastNotification>))}

            {/* ------------------------------------ */}
            </div>
            <ContentTemplateForm id="2" addNotification={this.props.addNotification} addTemplateHandler={this.addTemplateHandler} showNotification={this.showNotification}/>
      </div>
    )
  }
}
