import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DropdownKebab, MenuItem, Spinner } from 'patternfly-react';
import ModalUI from './ModalUI';
import { withRouter } from "react-router-dom";
import PaginationRow from 'patternfly-react/dist/js/components/Pagination/PaginationRow';
import { getAllTemplates, deleteTemplate } from '../integration/Template';
import { LASTPAGE, NOTIFICATION_OBJECT, PAGE, PAGECHANGEVALUE, PAGEINPUT, PAGESIZE, PERPAGEOPTIONS, TOTALITEMS, DEL_TEMPLATE_CONFIRM_MSG, DELETE_LABEL, EDIT_LABEL, NOTIFICATION_TYPE, NOTIFICATION_TIMER_ERROR, ADD_LABEL } from '../constant/constant';
import { v4 as uuidv4 } from 'uuid';

const perPageOptions = PERPAGEOPTIONS;

class TemplateDataTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templateData: [],
            modalShow: false,
            loading: true,
            selectedTempate: null,
            page: PAGE,
            currPageWillUpdating: 1,
            pageSize: PAGESIZE,
            totalItems: TOTALITEMS,
            lastPage: LASTPAGE,
            pageInput: PAGEINPUT,
            pageChangeValue: PAGECHANGEVALUE,
            // todo message No Template to show.
        };
    }



    onPageInput = e => {
        // todo make common method
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.page = e.target.value;
        this.setState({ currPageWillUpdating: e.target.value })
    }

    onPerPageSelect = (eventKey, e) => {
        const newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.perPage = eventKey;
        this.setState({ pageSize: newPaginationState.perPage });
    }

    componentDidMount = async () => {
        await this.getTemplates(this.props.selectedCollectionType);
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.selectedCollectionType !== this.props.selectedCollectionType ||
            prevState.pageSize !== this.state.pageSize) {
            await this.getTemplates(this.props.selectedCollectionType, true).then(res => {
                if (this.state.templateData.length) {
                    this.setState({currPageWillUpdating: PAGE})
                } else {
                    this.setState({currPageWillUpdating: 0})
                }
            });
        }
        if (prevState.page !== this.state.page) {
            await this.getTemplates(this.props.selectedCollectionType);
        }
    }

    modalHide = () => this.setState({ modalShow: false });

    /**
     * Method to delete a template
     */
     handleDelete = async () => {
        let notificationObj = NOTIFICATION_OBJECT;
        notificationObj.key = uuidv4(),
        await deleteTemplate(this.state.selectedTempate.id).then((res) => {
            this.componentDidMount();
            this.modalHide();
            if(res.isError) {
                notificationObj.type = NOTIFICATION_TYPE.ERROR;
                notificationObj.message = res.errorBody.response.data.message;
                notificationObj.timerdelay = NOTIFICATION_TIMER_ERROR;
            } else {
                notificationObj.type = NOTIFICATION_TYPE.SUCCESS;
                notificationObj.message = res.message;
            }
            this.props.addNotification(notificationObj);
        });
    }

    async getTemplates(selectedCollectionType, shouldInitPage = false) {
        const data = await getAllTemplates(shouldInitPage ? 1 : this.state.page, this.state.pageSize, selectedCollectionType);
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
        this.setState({ page: page, currPageWillUpdating: page })
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
        if (+this.state.currPageWillUpdating && this.state.currPageWillUpdating <= this.state.lastPage) {
            this.setState({ page: +this.state.currPageWillUpdating })
        }
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
            <>
                <div className="show-grid">
                    <Spinner
                        className=""
                        inline={false}
                        inverse={false}
                        loading={this.state.loading}
                        size="lg"
                    >
                        <div className="col-lg-11"></div>
                        <div className="col-lg-1 mv-2">
                            <Link to="/add-template">
                                <button className="btn-primary primary-btn mv-2 btn">
                                    <span>{ADD_LABEL}</span>
                                </button>
                            </Link>
                        </div>
                        <div className="col-lg-12">
                            <table className="table dataTable table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th width="45%">Name</th>
                                        <th width="45%">Type</th>
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
                                                            // onClick={() => this.props.history.push(`/edit-template/${el.code || el.attributes.code}`,{tid:el.id})}
                                                            onClick={() => this.props.history.push(`/edit-template/${el.id}`)}
                                                        >
                                                            {EDIT_LABEL}
                                                        </MenuItem>
                                                        <MenuItem
                                                            bsClass="dropdown"
                                                            disabled={false}
                                                            divider={false}
                                                            header={false}
                                                            onClick={() => this.setState({ modalShow: true, selectedTempate: el })}>
                                                            <span>
                                                                {DELETE_LABEL}
                                                            </span>
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
                                pageInputValue={this.state.currPageWillUpdating}
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

                <ModalUI modalShow={this.state.modalShow} modalHide={this.modalHide} type={'delete'} handleDelete={this.handleDelete} title={"Delete Template"}>
                    <div className="well">
                        <span aria-hidden="true" className='text-center'>
                        <div className="exclamation_icon">
                            <span aria-hidden="true" className="fa fa-exclamation"></span>
                        </div>

                        <h2>Delete  <b style={{wordBreak: "break-word"}}> {this.state.selectedTempate && this.state.selectedTempate.templateName && this.state.selectedTempate.templateName} </b></h2>
                        <h3> {DEL_TEMPLATE_CONFIRM_MSG} </h3>
                        </span>
                    </div>
                </ModalUI>
           </div>
            </>
        )
    }
}

export default withRouter(TemplateDataTable);