import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginForm from "./loginForm";
import './App.css';
import Register from "./Register";
import RegisterInfo from "./RegisterInfo";
import TakePhoto from "./TakePhoto";
import TakeRegisterPhoto from "./TakeRegisterPhoto";
import CandidateList from "./CandidateList";
import Welcome from "./Welcome";
import VerifyEmail from "./VerifyEmail";
import { Link, Redirect } from 'react-router-dom';
import AdminLogin from "./AdminLogin"
import MainHome from "./MainHome";
import CandidateDetail from "./CandidateDetail"


class Main extends Component {
    render() {
        return (
            <div>
                <div>
                    <Route exact path="/" component={MainHome}/>
                    <Route exact path="/Login" component={LoginForm} />
                    <Route exact path="/RegisterInfo" component={RegisterInfo} />
                    <Route exact path="/TakePhoto" component={TakePhoto} />
                    <Route exact path="/welcome" component={Welcome} />
                    <Route exact path="/verifyemail" component={VerifyEmail} />
                    <Route exact path="/takeregisterphoto" component={TakeRegisterPhoto} />
                    <Route exact path="/AdminLogin" component={AdminLogin} />
                    <Route exact path="/candidatelist" component={CandidateList} />
                    <Route exact path="/CandidateDetail" component={CandidateDetail} />
                </div>
            </div>
        );
    }
}
//Export The Main Component
export default Main;
