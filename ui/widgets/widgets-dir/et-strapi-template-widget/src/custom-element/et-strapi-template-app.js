import ReactDOM from "react-dom"
import React from "react"
import App from '../App'
import { KEYCLOAK_EVENT_TYPE, subscribeToWidgetEvent } from "../helpers/widgetEvents"

const getKeycloakInstance = () =>
    (window && window.entando && window.entando.keycloak && { ...window.entando.keycloak, initialized: true }) || {
        initialized: false,
    }

class EtApp extends HTMLElement {
    connectedCallback() {
        this.mountPoint = document.createElement('span')
        this.keycloak = {...getKeycloakInstance(), initialized: true}
        this.unsubscribeFromKeycloakEvent = subscribeToWidgetEvent(KEYCLOAK_EVENT_TYPE, (e) => {
            if(e.detail.eventType==="onReady"){
                this.keycloak = {...getKeycloakInstance(), initialized: true}
                this.render()
            }
        })
    }

    render() {
        ReactDOM.render(<App/>,this.appendChild(this.mountPoint))
    }
}

customElements.get('et-strapi-template-app') || customElements.define("et-strapi-template-app", EtApp)
