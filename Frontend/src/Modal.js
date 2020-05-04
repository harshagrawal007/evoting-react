import React, { Component, useState } from "react";
import { Button, Modal } from 'react-bootstrap';

class ModalToInstallMeta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    handleClose = () => {
        console.log("in close");
        this.state.show = false;
        console.log(this.state.show);
    }
    handleShow = () => {
        this.state.show = true;
    }
    componentDidMount(){
        this.handleShow();
    }

    render() {
        this.handleShow();
        console.log("og "+this.state.show)
        return (
            <>hmm{this.state.show}
            <Modal show={this.state.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>oho</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.props.handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        );
      }
}
export default ModalToInstallMeta;
