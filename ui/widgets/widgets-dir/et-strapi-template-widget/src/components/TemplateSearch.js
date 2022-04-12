import React, { Component } from 'react'
import { getCollectionTypes } from '../integration/Template'

export default class TemplateSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionType: []
        };
    }

    componentDidMount = async () => {
        const collectionTypeList = await getCollectionTypes();
    }

    render() {
        return (
            <div className="well" style={{ height: "15rem" }}>
                <div style={{ position: "relative", zIndex: "0" }}>
                    <div className="container-fluid">
                        <div className="show-grid row">
                            <div className="col-lg-1" style={{ fontSize: "large", fontWeight: "500" }}>Search</div>
                            <div className="col-lg-10"></div>
                        </div>
                        <div className="show-grid row" style={{ height: "3.2rem" }}>
                            <div className="col-lg-1"></div>
                            <div className="col-lg-1"
                                style={{ fontSize: "larger", fontWeight: "600", position: "relative", top: "50%", transform: "translateY(-50%)", }}>
                                Type
                            </div>
                            <select className="col-lg-7" name="cars" id="cars" style={{ height: "100%", marginLeft: '2rem' }}>
                                <option value="volvo">PBC</option>
                                <option value="saab">Saab</option>
                                <option value="opel">Opel</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <div className="show-grid row" style={{ marginTop: "1rem" }}>
                            <div className="col-lg-7"></div>
                            <div className="col-lg-4" style={{ marginLeft: "5rem" }}>
                                <button className="btn btn-primary">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
