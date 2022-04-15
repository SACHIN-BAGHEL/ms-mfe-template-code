import React, { Component } from 'react'
import { getSanitizedCollectionTypes } from '../helpers/helpers';
import { getCollectionTypes } from '../integration/Template'

export default class TemplateSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionType: [],
            selectedCollectionType: "All"
        };
    }

    componentDidMount = async () => {
        this.getCollectionType();
    }

    getCollectionType = async () => {
        //Remove later
        // const { data: { data } } = await getCollectionTypes();
        // if (data.length) {
        //     const collectionListData = data.filter((el) => el.uid.startsWith('api::') &&  el.isDisplayed);
        //     this.setState({ collectionType: collectionListData });
        // }
        const sanitizedCollectionTypes = await getSanitizedCollectionTypes();
        this.setState({ collectionType: sanitizedCollectionTypes });
    }

    collectionTypeOnChange = (event) => this.setState({ selectedCollectionType: event.target.value });
    collectionTypeOnClick = () => this.props.collectionTypeOnChange(this.state.selectedCollectionType);

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
                            <select onChange={this.collectionTypeOnChange} className="col-lg-7" name="cars" id="cars" style={{ height: "100%", marginLeft: '2rem' }}>
                                <option value="all">All</option>
                                {/* {this.state.collectionType.map(el => <option key={el.apiID} value={el.apiID.charAt(0).toUpperCase() + el.apiID.slice(1)}>{el.apiID.charAt(0).toUpperCase() + el.apiID.slice(1)}</option>)} */}
                                {this.state.collectionType.map(el => <option key={el.displayName} value={el.displayName}>{el.displayName}</option>)}
                            </select>
                        </div>
                        <div className="show-grid row" style={{ marginTop: "1rem" }}>
                            <div className="col-lg-7"></div>
                            <div className="col-lg-4" style={{ marginLeft: "5rem" }}>
                                <button onClick={this.collectionTypeOnClick} className="btn btn-primary">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
