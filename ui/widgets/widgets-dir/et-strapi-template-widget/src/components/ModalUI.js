import React, { Component } from 'react'
import { Button } from 'patternfly-react/dist/js/components/Button'
import { Icon } from 'patternfly-react/dist/js/components/Icon'
import { Modal } from 'patternfly-react/dist/js/components/Modal'

export default class ModalUI extends Component {
    render() {
        return (
            <Modal show={this.props.modalShow} onHide={this.props.modalHide}>
                <Modal.Header>
                    <button
                        className="close"
                        onClick={this.props.modalHide}
                        aria-hidden="true"
                        aria-label="Close"
                    >
                        <Icon type="pf" name="close" />
                    </button>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2 className='text-center'>
                        <strong>
                            Do you really want to delete this template
                        </strong>
                    </h2>
                    {/* {JSON.stringify(this.props.selectedTemp)} ? */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle="default"
                        className="btn-cancel"
                        onClick={this.props.modalHide}
                    >
                        Close
                    </Button>
                    <Button
                        bsStyle="danger"
                        className="btn-delete"
                        onClick={this.props.handleDelete}
                    >
                        delete
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
