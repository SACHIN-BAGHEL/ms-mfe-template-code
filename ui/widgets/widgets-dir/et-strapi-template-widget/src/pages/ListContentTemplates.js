import React, { Component } from 'react'
import TemplateDataTable from '../components/TemplateDataTable'
import TemplateSearch from '../components/TemplateSearch'
import { TimedToastNotification} from 'patternfly-react';
import { TOASTER_POSITION } from '../constant/constant';
import { v4 as uuidv4 } from 'uuid';
export default class ListContentTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCollectionType: "All",
            notifications: []
        };

        this.removeNotificationAction = notificationToRemove => {
            this.setState({
                notifications: this.state.notifications.filter(notification => notificationToRemove.key !== notification.key)
            });
        };

        this.showNotification = this.showNotification.bind(this);
    }

    showNotification = (notificationToAdd) => {
        // console.log("heck",notificationToAdd)
        // this.state.notifications.push(notificationToAdd);
        // this.setState({
        //     notifications: this.state.notifications
        // });
        this.props.addNotification({
            key: uuidv4(),
            message:notificationToAdd.message,
            persistent:notificationToAdd.persistent,
            timerdelay:notificationToAdd.timerdelay,
            type:notificationToAdd.type,
        });
    }

    collectionTypeOnChange = (selectedCollectionType) => this.setState({selectedCollectionType});

    render() {
        return (
            <div className={"mv-2"}>

            {/* ------ Show Notifications ------- */}
            <div style={TOASTER_POSITION}>
                {this.state.notifications.map(notification => (
                <TimedToastNotification
                    key={notification.key}
                    type={notification.type}
                    persistent={true}
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

                <TemplateSearch collectionTypeOnChange={this.collectionTypeOnChange} />
                <TemplateDataTable selectedCollectionType={this.state.selectedCollectionType} showNotification={this.showNotification} />
        </div>
        )
    }
}
