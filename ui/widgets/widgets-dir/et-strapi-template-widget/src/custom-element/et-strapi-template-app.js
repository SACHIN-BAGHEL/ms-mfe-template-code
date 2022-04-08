import ReactDOM from "react-dom"
import React from "react"
import App from '../App'



class EtApp extends HTMLElement {
    connectedCallback() {
        this.mountPoint = document.createElement('span')
        this.render()
    }

    render() {
        ReactDOM.render(<App/>,this.appendChild(this.mountPoint))
    }
}

customElements.get('et-strapi-template-app') || customElements.define("et-strapi-template-app", EtApp)
