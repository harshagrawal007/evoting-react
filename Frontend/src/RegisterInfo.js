import React, { Component } from "react";
import renderHTML from 'react-render-html';
import { Link, Redirect } from 'react-router-dom';
import './RegisterInfo.css';
import RegisterStorage from "./stores/RegisterStorage";
import swal from "sweetalert2";
import web3 from './web3';
import ModalToInstallMeta from "./Modal";
import { Button, Modal } from 'react-bootstrap';
import MainHome from "./MainHome";
import SubmitButton from './submitButton';

const notifier = require('node-notifier');

class RegisterInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            fname: '',
            lname: '',
            dob: '',
            gender: '',
            email: '',
            username:'',
            metaMaskInstalled: '',
            show: true,
            showModal: false
        };
        this.onChange = this.onChange.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount(){
        
    }
    handleClose = () => {
        this.state.show = false;
    }
    handleShow = () => {
        this.state.show = true;
    }
    showtext() {
        var date = document.getElementById("email");
        console.log(date.innerHTML);
        date.type = "date";
        if (date.textContent == "") {
            console.log(date);
            date.type = "text";
        }
        else date.type = "date";
    }

    showModal() {
        console.log(' in modal')
        this.state.showModal = true;
    }

    handleClose() {
        this.state.showModal = false;
    }
  
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 15) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    pwstrength() {
        var password = document.getElementById("password").value;
        document.getElementById("pwmsg").style.visibility = "visible";
        var bar = document.getElementById("strength");
        var val = bar.value;
        bar.style.visibility = "visible";
        console.log(password.length);
        bar.low = "0.45";
        bar.high = "0.75";
        bar.optimum = "0.8";
        if (password.length < 6) {
            bar.value = "0.3";
            bar.background = "red";
        }
        else if (password.length < 9) bar.value = "0.55";
        else bar.value = "0.8";
    }

    async doRegisterPost() {
        if (!this.state.password)
            return;

            try {
                let res = await fetch('http://localhost:3003/registerpost', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: this.state.password,
                        username:this.state.username,
                        fname: this.state.fname,
                        lname: this.state.lname,
                        dob: this.state.dob,
                        gender: this.state.gender,
                        email: this.state.email
                    })
                });
                let result = await res.json();
                
                console.log("pass word in registerinfo: "+this.state.password);
                if (result && result.success) {
                    swal.fire({
                        icon: 'success',
                        title: "Verification Email Sent!",
                        text: "Enter the OTP to verify your Email",
                        type: "Success",
                        confirmButtonText: "OK"
                      });
                    
                    console.log("success");
                    RegisterStorage.email = this.state.email
                    RegisterStorage.username = this.state.username
                    this.props.history.push({
                        pathname: "/verifyemail",
                        state: {
                            password: this.state.password,
                            username:this.state.username,
                            fname: this.state.fname,
                            lname: this.state.lname,
                            dob: this.state.dob,
                            gender: this.state.gender,
                            email: this.state.email
                        }
                    });
                }
    
                else if (result && result.success === false) {
                    console.log("registration failed ")
                    swal.fire({
                        icon: 'error',
                        title: 'Registration failed',
                        text: 'Try Again',
                        confirmButtonText: "OK"
                    });
                    this.props.history.push("/RegisterInfo");
                }
            }
            catch (e) {
    
            }
    }
        
    render() {
        if(typeof web3 !== 'undefined')
        {
            console.log("Metamask installed..");
                return (
                    <div className="container">
                        <div className= "header">
                        <ul className="navbar-nav" id="navg">
                            <li className="nav-item">
                                <a className=" brand">Electronic Ballot</a>
                            </li>
                            <li className="nav-item">
                                <a className="colorb">on BlockChain</a>
                            </li>
                            <Link to="/AdminLogin" className="nav-item nav-link admin" id="log"> Setup-Campaign
                            </Link>
                            <Link to="/RegisterInfo" className="nav-item nav-link reg3" id="log"> Register
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
                    <div className="registerimage"></div>
                    <div className="qoute">
                                <div className ="h3" className="since-title"> Helping People Connect
                                        <br></br>Since 2020
                                        <p>Security & Trust</p>
                                </div>
                    </div>
                    <div className="overlayingreg">Create Account
                                        <input type="text" className="registerclass" id="fname"  value={this.state.fname}  onChange={this.onChange}  name="fname" placeholder="Please enter your first name" required>
                                        </input>
                                        <br></br>
                                        <input type="text" className="registerclass" id="lname"  value={this.state.lname} onChange={this.onChange}  name="lname" placeholder="Please enter your Last name" required>
                                        </input>
                                        <br></br>
                                        <input type="text" className="registerclass" id="email"  value={this.state.email} onChange={this.onChange}  name="email" placeholder="Please enter your Email" required>
                                        </input>
                                        <br></br>
                                        <input type="text" className="registerclass" id="username"  value={this.state.username} onChange={this.onChange}  name="username" placeholder="Please enter your username" required>
                                        </input>
                                        <br></br>
                                        <input type="password"  value={this.state.password} onChange={this.onChange}  className="registerclass" onInput={() => this.pwstrength()} id="password" name="password" placeholder="Please enter a password" required>
                                        </input>
                                        <br></br>
                                        <input type="date" placeholder="Please Enter your Date of Birth"
                                            // onFocus={this.type = 'date'} 
                                            className="registerclass" value={this.state.date} onChange={this.onChange}  id="dob" name="dob" placeholder="Please provide your DoB in mm/dd/yyyy format" required>
                                        </input>
                                        <br></br>
                                        <input type="list" value={this.state.gender}  onChange={this.onChange} list="genderoptions" className="registerclass" id="gender" name="gender" placeholder="Please select your gender" required >
                                        </input>
                                        <datalist id="genderoptions">
                                            <option value="Female"></option>
                                            <option value="Male"></option>
                                        </datalist>
                                        <span className="pwdstrength" id="pwmsg"> Password Strength: </span><br></br>
                                        <meter className="meter " id="strength"></meter>
                                        <button className="rg" id="rg" onClick={() => this.doRegisterPost()}>Register</button>
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
                );
        }

        else if(typeof web3 === 'undefined')
        {
            console.log("Metamask is not installed..");
            swal.fire({
                icon: 'error',
                title: "Metamask extension not found!",
                html:
                    'Kindly install metamask ' +
                    '<a href="https://metamask.io/">from this link</a> ' +
                    'in order to use the website.',
                confirmButtonText:
                    '<i class="fa fa-thumbs-up"></i> Got it!',
                confirmButtonAriaLabel: 'Thumbs up, great!'
              });
              return(<div>
                  <MainHome></MainHome>
              </div>);
        }
        else
        {
            return(
                <div></div>
            );
        }
    }
}
export default RegisterInfo;
