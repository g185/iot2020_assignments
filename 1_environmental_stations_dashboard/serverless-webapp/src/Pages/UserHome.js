import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

import RegisterDialog from '../Components/RegisterDialog.js';
import LoginDialog from '../Components/LoginDialog.js';
import NavBar from '../Components/NavBar.js';
import Footer from '../Components/Footer.js';

import { Button, ButtonToolbar, ButtonGroup, Alert, Panel } from 'react-bootstrap';
import AddEventDialog from '../Components/AddEventDialog.js';

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            eventList2: [],
            len2:0
        };
    }//end constructor

    //called after mount, start refresh interval and build the list 
	componentDidMount() {
        //this permits the page to be refreshed every 15 seconds
    	this.interval = setInterval(function() {
                  window.location.reload();
                }, 15000); 
    	this.buildEventList(); 
  	}
    //this function clears interval
  	componentWillUnmount() {
    	clearInterval(this.interval);
  	}


    buildEventList() {
        let self = this;
        //this calls the two stations values and insert the in eventList
        axios.get(global.APIURL1)
            .then(function (response) {
                // handle success
                console.log("Axios get result:" + response.data.body);
                self.setState({ eventList: JSON.parse(response.data.body) });
            })
            .catch(function (error) {
                // handle error
                console.log("Axios error:" + JSON.stringify(error));
            })
            .then(function () {
                // always executed
            });
        //this calls the sensor values and inser the in the eventList2, it also insert the number of items for each sensor
        //using variable len2
        axios.get(global.APIURL2)
            .then(function (response) {
                // handle success
                console.log("Axios get result:" + response.data.body);
                self.setState({ eventList2: JSON.parse(response.data.body)});
                let len = JSON.parse(response.data.body)[0].length;
                self.setState({ len2 : len });
            })
            .catch(function (error) {
                // handle error
                console.log("Axios error:" + JSON.stringify(error));
            })
            .then(function () {
                // always executed
            });
    }

    render() {
        console.log("Length = " + this.state.eventList.length);
        let panelEvents = [];
        //creates panels for 2 stations
        for (let i = 0; i < this.state.eventList.length; i++) {
            panelEvents.push(<Panel key={i}>
                <Panel.Heading responsive="true">
                    <Panel.Title componentClass="h3">Station {this.state.eventList[i].payload.deviceId} Latest Values</Panel.Title>
                </Panel.Heading>
                <Panel.Body responsive="true">
                    <p>Date Time: {this.state.eventList[i].datetime}</p>
                    <p>Humidity: {this.state.eventList[i].payload.humidity}</p>
                    <p>Temperature: {this.state.eventList[i].payload.temperature}</p>
                    <p>Wind Direction: {this.state.eventList[i].payload.windDirection}</p>
                    <p>Wind Intensity: {this.state.eventList[i].payload.windDirection}</p>
                    <p>Rain Heigth: {this.state.eventList[i].payload.rainHeigth}</p>
                    
                </Panel.Body>
            </Panel>);
        }

        //create panels for other values
        let panelEventsTemp = [];
            for (let j = 0; j < this.state.len2; j++) {
                panelEventsTemp.push(<Panel key={j}>
                    <Panel.Heading responsive="true">
                        <Panel.Title componentClass="h3">Date Time: {this.state.eventList2[0][j].datetime} Station: {this.state.eventList2[0][j].deviceId} {this.state.eventList2[0][j].obj}: {this.state.eventList2[0][j].value}</Panel.Title>
                    </Panel.Heading>
                </Panel>);
            }
        let panelEventsHum = [];
            for (let j = 0; j < this.state.len2; j++) {
                panelEventsHum.push(<Panel key={j}>
                    <Panel.Heading responsive="true">
                        <Panel.Title componentClass="h3">Date Time: {this.state.eventList2[1][j].datetime} Station: {this.state.eventList2[1][j].deviceId} {this.state.eventList2[1][j].obj}: {this.state.eventList2[1][j].value}</Panel.Title>
                    </Panel.Heading>
                </Panel>);
            }
        let panelEventswDir = [];
            for (let j = 0; j < this.state.len2; j++) {
                panelEventswDir.push(<Panel key={j}>
                    <Panel.Heading responsive="true">
                        <Panel.Title componentClass="h3">Date Time: {this.state.eventList2[2][j].datetime} Station: {this.state.eventList2[2][j].deviceId} {this.state.eventList2[2][j].obj}: {this.state.eventList2[2][j].value}</Panel.Title>
                    </Panel.Heading>
                </Panel>);
            }
        let panelEventswInt = [];
            for (let j = 0; j < this.state.len2; j++) {
                panelEventswInt.push(<Panel key={j}>
                    <Panel.Heading responsive="true">
                        <Panel.Title componentClass="h3">Date Time: {this.state.eventList2[3][j].datetime} Station: {this.state.eventList2[3][j].deviceId} {this.state.eventList2[3][j].obj}: {this.state.eventList2[3][j].value}</Panel.Title>
                    </Panel.Heading>
                </Panel>);
            }
        let panelEventsrHgt = [];
            for (let j = 0; j < this.state.len2; j++) {
                panelEventsrHgt.push(<Panel key={j}>
                    <Panel.Heading responsive="true">
                        <Panel.Title componentClass="h3">Date Time: {this.state.eventList2[4][j].datetime} Station: {this.state.eventList2[4][j].deviceId} {this.state.eventList2[4][j].obj}: {this.state.eventList2[4][j].value}</Panel.Title>
                    </Panel.Heading>
                </Panel>);
            }
        return (
            <div>
                <ButtonToolbar>
                    <NavBar />
                </ButtonToolbar>
                {panelEvents}
                <div>
                    <h4>Last Hour Temperatures</h4>
                </div>
                {panelEventsTemp}
                <div>
                    <h4>Last Hour Humidity</h4>
                </div>
                {panelEventsHum}
                <div>
                    <h4>Last Hour Wind Directions</h4>
                </div>
                {panelEventswDir}
                <div>
                    <h4>Last Hour Wind Intensity</h4>
                </div>
                {panelEventswInt}
                <div>
                    <h4>Last Hour Rain Heigth</h4>
                </div>
                {panelEventsrHgt}
                <Footer />
            </div>
        );
    }

}

export default withRouter(UserHome);