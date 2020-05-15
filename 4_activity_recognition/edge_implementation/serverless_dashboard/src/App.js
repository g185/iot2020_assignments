import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserHome from './Pages/UserHome.js';


class App extends Component {
  constructor(props) {
    super(props);
    //AWS Lambda function API for getting latest values for the two environmental stations
    global.APIURL1 = '';
    //AWS Lambda function API for getting latest sensor values
    global.APIURL2 = '';


  }
  myRouterSwitch() {
    let myHomePage = <UserHome />;

    return (
      <Switch>
        <Route exact path="/" component={UserHome} />
      </Switch>
    );
  }//end myRouterSwitch
  handleSelect(eventKey) {
    //event.preventDefault();
    alert(`selected ${eventKey}`);
  }

  render() {
    let routerSwitch = this.myRouterSwitch();
    return (
      <div className="App">
        <Router history={Router.HistoryLocation} >
          {routerSwitch}
        </Router>
      </div>
    );
  }
}

export default App;
