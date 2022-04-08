import Paginator from 'patternfly-react/dist/js/components/Pagination/Paginator'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
// import { deleteTemplate, getTemplate } from '../api/Api'
import { DropdownKebab, MenuItem } from 'patternfly-react';
import ModalUI from './ModalUI';
import { withRouter } from "react-router-dom";
import Pagination from './Pagination';
import PaginationRow from 'patternfly-react/dist/js/components/Pagination/PaginationRow';
import { getAllTemplates } from '../integration/Template';

const perPageOptions = [5, 10, 15, 25, 50];

class TemplateDataTable extends Component {

    constructor(props) {
        super(props);
        this.state = { templateData: [], modalShow: false, selectedTempate: null, page:1, pageSize:5, totalItems:20, lastPage:4, pageInput: 1, pagination: {
            page: 1,
            perPage: 6,
            perPageOptions: [6, 10, 15]
          },
    
          // page input value
          pageChangeValue: 1 };
    }

    onPageInput = e => {
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.page = e.target.value;
        this.setState({ pagination: newPaginationState });
        this.setState({pageSize: newPaginationState.perPage})
    }

    onPerPageSelect = (eventKey, e) => {
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.perPage = eventKey;
        console.log("EWWWW",newPaginationState.perPage)
        this.setState({ pagination: newPaginationState });
        this.setState({ pageSize: newPaginationState.perPage });
    }

    componentDidMount = async () => {
        //  // todo 
        const templateList = await getAllTemplates();
        if (templateList) this.setState({ templateData: templateList.categoryList });
    }

    modalHide = () => {
        this.setState({ modalShow: false });
    }

    handleDelete = async () => {
        await deleteTemplate(this.state.selectedTempate.code).then((res) => {
            this.componentDidMount();
            this.modalHide();
        });
    }

    changePage(page) {
        this.setState({page: page})
        const { fetchList, pageSize } = this.state;
        // fetchList({ page, pageSize });
    }

    changePageSize(pageSize) {
        const { fetchList } = this.state;
        // fetchList({ page: 1, pageSize });
    }

    onPageInput = e => {
        this.setState({ page: e.target.value });
    };

    setPage = value => {
        const page = Number(value);
        if (
            !Number.isNaN(value) &&
            value !== '' &&
            page > 0 &&
            page <= this.totalPages()
        ) {
            let newPaginationState = Object.assign({}, this.state.pagination);
            newPaginationState.page = page;
            this.setState({ pagination: newPaginationState, pageChangeValue: page });
        }
    }

    onSubmit = () => {
        console.log("hello")
        console.log(this.state.pageInput);
        this.setPage(this.state.page);
    };

    render() {
        console.log("STATE",this.state)
        const pagination = {
            page: this.state.page,
            perPage: this.state.pageSize,
            perPageOptions,
        };

        const itemsStart = this.state.totalItems === 0 ? 0 : ((this.state.page - 1) * this.state.pageSize) + 1;
        const itemsEnd = Math.min(this.state.page * this.state.pageSize, this.state.totalItems);

        return (
            <div className="show-grid">
                <div className="col-lg-12">
                    <table className="table dataTable table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th width="5%">Id</th>
                                <th width="5%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.templateData && this.state.templateData.map((el, idx) => {
                                console.log(
                                    'el', el
                                );
                                return (
                                    <tr key={idx}>
                                        <td>{el.templateName}</td>
                                        <td>{el.collectionType}</td>
                                        <td>{el.id}</td>
                                        <td>
                                        <DropdownKebab
                                                className=""
                                                // componentClass={function noRefCheck() { }}
                                                id={el.id}
                                                pullRight={true}
                                                title="Kebab title"
                                                toggleStyle="link"
                                            >
                                                <MenuItem
                                                    bsClass="dropdown"
                                                    disabled={false}
                                                    divider={false}
                                                    header={false}
                                                    onClick={() => this.setState({ modalShow: true, selectedTempate: el})}
                                                >
                                                    <span>
                                                        Delete
                                                    </span>
                                                </MenuItem>
                                                <MenuItem
                                                    bsClass="dropdown"
                                                    disabled={false}
                                                    divider={false}
                                                    header={false}
                                                    onClick={()=>this.props.history.push(`/edit-template/${el.code || el.attributes.code}`)}
                                                >
                                                    {/* <Link to={`/edit-template/${el.code || el.attributes.code}`}> */}
                                                        Edit
                                                    {/* </Link> */}
                                                </MenuItem>

                                            </DropdownKebab>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="custom-page"></div>
                    {/* <PaginationRow
                        viewType={"list"}
                        pageInputValue={this.state.page}
                        pagination={this.state.pagination}
                        amountOfPages={this.state.lastPage}
                        pageSizeDropUp={true}
                        itemCount={this.state.totalItems}
                        itemsStart={itemsStart}
                        itemsEnd={itemsEnd}
                        onPerPageSelect={this.onPerPageSelect}
                        onFirstPage={() => this.changePage(1)}
                        onPreviousPage={() => this.changePage(this.state.page - 1)}
                        onPageInput={this.onPageInput}
                        onNextPage={() => this.changePage(this.state.page + 1)}
                        onLastPage={() => this.changePage(this.state.lastPage)}
                    /> */}
                    <PaginationRow
                        itemCount={this.state.totalItems}
                        itemsStart={itemsStart}
                        itemsEnd={itemsEnd}
                        viewType="table"
                        pagination={pagination}
                        amountOfPages={this.state.lastPage}
                        pageInputValue={this.state.page}
                        onPageSet={this.changePage}
                        onPerPageSelect={this.onPerPageSelect}
                        onFirstPage={() => this.changePage(1)}
                        onPreviousPage={() => this.changePage(this.state.page - 1)}
                        onPageInput={this.onPageInput}
                        onNextPage={() => this.changePage(this.state.page + 1)}
                        onLastPage={() => this.changePage(this.state.lastPage)}
                        onSubmit={this.onSubmit}
                        // messages={messages} 
                    />
                </div>
                <div className="col-lg-10"></div>
                <div className="col-lg-2">
                    <Link to="/add-template">
                        <button className="primary-btn mv-2">
                            <span>Add content template </span>
                        </button>
                    </Link>
                </div>
                <ModalUI modalShow={this.state.modalShow} modalHide={this.modalHide} handleDelete={this.handleDelete} selectedTemp={this.state.selectedTempate}/>
            </div>
        )
    }
}

export default withRouter(TemplateDataTable);