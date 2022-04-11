import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DropdownKebab, MenuItem, Spinner } from 'patternfly-react';
import ModalUI from './ModalUI';
import { withRouter } from "react-router-dom";
import PaginationRow from 'patternfly-react/dist/js/components/Pagination/PaginationRow';
import { getAllTemplates } from '../integration/Template';

const perPageOptions = [5, 10, 15, 25, 50];

class TemplateDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateData: [],
            modalShow: false,
            loading: true,
            selectedTempate: null,
            page: 1,
            pageSize: 5,
            totalItems: 20,
            lastPage: 4,
            pageInput: 1,
            pageChangeValue: 1
        };
    }

    onPageInput = e => {
        // todo make common method
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.page = e.target.value;
        this.setState({ pageSize: newPaginationState.perPage })
    }

    onPerPageSelect = (eventKey, e) => {
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.perPage = eventKey;
        this.setState({ pageSize: newPaginationState.perPage });
    }

    componentDidMount = async () => {
        await this.getTemplates();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.page !== this.state.page || prevState.pageSize !== this.state.pageSize) {
            await this.getTemplates();
        }
    }

    modalHide = () => this.setState({ modalShow: false });

    handleDelete = async () => {
        await deleteTemplate(this.state.selectedTempate.code).then((res) => {
            this.componentDidMount();
            this.modalHide();
        });
    }

    async getTemplates() {
        const data = await getAllTemplates(this.state.page, this.state.pageSize);
        if (data || !isError) {
            const { payload } = data.templateList;
            const { lastPage, page, pageSize, totalItems } = data.templateList.metadata;
            this.setState({
                templateData: payload,
                loading: false,
                lastPage: lastPage,
                page: page,
                pageSize: pageSize,
                totalItems: totalItems
            });
        }
    }

    changePage(page) {
        this.setState({ page: page })
    }

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
        this.setPage(this.state.page);
    };

    render() {
        const pagination = {
            page: this.state.page,
            perPage: this.state.pageSize,
            perPageOptions,
        };

        const itemsStart = this.state.totalItems === 0 ? 0 : ((this.state.page - 1) * this.state.pageSize) + 1;
        const itemsEnd = Math.min(this.state.page * this.state.pageSize, this.state.totalItems);

        return (
            <div className="show-grid">
                <Spinner
                    className=""
                    inline={false}
                    inverse={false}
                    loading={this.state.loading}
                    size="lg"
                >
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
                                                        onClick={() => this.setState({ modalShow: true, selectedTempate: el })}>
                                                        <span>
                                                            Delete
                                                        </span>
                                                    </MenuItem>
                                                    <MenuItem
                                                        bsClass="dropdown"
                                                        disabled={false}
                                                        divider={false}
                                                        header={false}
                                                        onClick={() => this.props.history.push(`/edit-template/${el.code || el.attributes.code}`)}
                                                    >
                                                        Edit
                                                    </MenuItem>
                                                </DropdownKebab>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="custom-page"></div>
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
                            // messages={messages} i18n
                        />
                    </div>
                </Spinner>
                <div className="col-lg-10"></div>
                <div className="col-lg-2">
                    <Link to="/add-template">
                        <button className="primary-btn mv-2">
                            <span>Add content template </span>
                        </button>
                    </Link>
                </div>
                <ModalUI modalShow={this.state.modalShow} modalHide={this.modalHide} handleDelete={this.handleDelete} selectedTemp={this.state.selectedTempate} />
            </div>
        )
    }
}

export default withRouter(TemplateDataTable);