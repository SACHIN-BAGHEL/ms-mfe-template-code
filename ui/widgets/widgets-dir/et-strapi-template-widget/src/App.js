import React, { Component } from 'react'
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ContentTemplates from './pages/ConentTemplates';

import './App.css';
import AddContentTemplate from './pages/AddContentTemplate';
import EditContentTemplate from './pages/EditContentTemplate';

export default class App extends Component {
  render() {
    return (
      <div>
            <BrowserRouter>
                {/* <Route path="/" exact><Pagination /></Route> */}
                <Route path="/" exact><ContentTemplates /></Route>
                <Route path="/add-template" exact><AddContentTemplate /></Route>
                <Route path="/edit-template/:templateId" exact><EditContentTemplate /></Route>
            </BrowserRouter>
      </div>
    )
  }
}

// import {getData} from "./integration/Integration";
// import {useState} from "react";

// function App() {
//     const [payload, setPayload] = useState("")

//     async function callTheApi() {
//         const responseObj = await getData();
//         if (responseObj["response"]) {
//             console.log('ssssss', responseObj.response.data.data[0].attributes);
//             const attr = responseObj.response.data.data[0].attributes.Title
//             setPayload(attr)
//         }else{
//             setPayload(responseObj.error.message)
//         }
//     }

//     return (
//         <>
//             <h1>Test MS and MFE</h1>
//             <div>
//                 <button onClick={callTheApi}>call the api</button>
//             </div>
//             <div>
//                 <span>{payload}</span>
//             </div>
//         </>
//     )
// }

// export default App
