import React, { Component } from 'react'
import EditContentTemplateForm from '../components/EditContentTemplateForm';
import { TimedToastNotification} from 'patternfly-react';

export default class EditContentTemplate extends Component {
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
        this.showNotification = this.showNotification.bind(this);
    }

    showNotification = (notificationToAdd) => {
        this.state.notifications.push(notificationToAdd);
        this.setState({
            notifications: this.state.notifications
        });
    }

    editTemplateHandler=(formData) =>{
        console.log("editContentTemplate",formData);
        //Need to call API
      }

    render() {
        return (
            <div>
                {/* ------ Show Notifications ------- */}
                <div id="1" align="right" margin="50px" style={{ zIndex: 1 }}>
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
                <EditContentTemplateForm id="2" editTemplateHandler={this.editTemplateHandler} showNotification={this.showNotification}/>
            </div>
        )
    }
}
