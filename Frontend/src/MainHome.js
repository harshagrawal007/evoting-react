import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginForm from "./loginForm";
import './App.css';
import Register from "./Register";
import RegisterInfo from "./RegisterInfo";
import TakePhoto from "./TakePhoto";
import TakeRegisterPhoto from "./TakeRegisterPhoto";
import Welcome from "./Welcome";
import VerifyEmail from "./VerifyEmail";
import { Link, Redirect } from 'react-router-dom';


class MainHome extends Component {
    render() {
        return (
            <div>
                <div className='container'>
                    <div className="header">
                        <ul className="navbar-nav" id="navg">
                            <li className="nav-item">
                                <a className=" brand">Electronic Ballot</a>
                            </li>
                            <li className="nav-item">
                                <a className="colorb">on BlockChain</a>
                            </li>
                            <Link to="/AdminLogin" className="nav-item nav-link admin" id="log"> Setup-Campaign
                            </Link>
                            <Link to="/RegisterInfo" className="nav-item nav-link reg" id="log"> Register
                            </Link>
                            <Link to="/Login" className="nav-item nav-link log" id="log"> Login
                            </Link>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="pitchline" id="pitch">
                            <div id="Main">Online election perfection!</div>
                            <div id="about">Our E-Voting solution is here for you.</div>
                        </div>
                    </div>

                    <div className="maps"></div>
                    <div className="qoute">
                        <div className="h3" className="since-title"> Helping People Connect
                                    <br></br>Since 2020
                                    <p>Security & Trust</p>
                        </div>
                    </div>

                    <div className="row">
                        < div className="reviews">
                            <div className="reviewtitle">
                                <div className=" h3 titlemessage"> Straight from the horses mouth! </div>
                                <span></span>
                                <p>ElectronicBallot has been rated 4.8 out of 5 stars with 430000+ reviews</p>
                            </div>
                            <div className="col-md-4 customer">
                                <div className="photoandstar">
                                    <div className="custname">Vrushali</div>
                                    <div className="custphoto1"></div>
                                    <div className="stars">
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                    </div>
                                </div>
                                <div className="review">
                                    When nothing else worked, ElectronicBallot came to the rescue.
                                </div>
                            </div>
                            <div className="col-md-4 customer">
                                <div className="photoandstar">
                                    <div className="custname">Nistha</div>
                                    <div className="custphoto2"></div>
                                    <div className="stars">
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                    </div>
                                </div>
                                <div className="review">
                                    Easy and hassle free.
                                </div>
                            </div>
                            <div className="col-md-4 customer">
                                <div className="photoandstar">
                                    <div className="custname">Aditya</div>
                                    <div className="custphoto3"></div>
                                    <div className="stars">
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                    </div>
                                </div>
                                <div className="review">
                                    ElectronicBallot has reduced the voting time by 90%.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
//Export The Main Component
export default MainHome;
