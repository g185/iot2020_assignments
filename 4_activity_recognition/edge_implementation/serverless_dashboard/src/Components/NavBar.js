import React, { Component } from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { Button, ButtonToolbar, Nav, NavItem, navInstance, Modal, Form, FormControl, FormGroup, Alert, Col, ControlLabel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import RegisterDialog from '../Components/RegisterDialog.js';
import LoginDialog from '../Components/LoginDialog.js';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.openHome = this.openHome.bind(this);
    }//end constructor

    openHome() {
        this.props.history.push('/');
    }


    render() {
        var divStyle = {
            color: 'red',
            
          };
        return (
            <div style={{ paddingLeft: '10px',  backgroundColor: 'black'}}>


                <Nav style={divStyle} bsStyle="pills" activeKey={1} onSelect={this.handleSelect}>
                    <Button bsStyle="info" bsSize="large" active onClick={this.openHome}>
                        Accelerometer App
                    </Button>
                </Nav>

            </div>
        )
    }// render
}

export default withRouter(NavBar);