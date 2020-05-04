import React, { Component } from "react";
import axios from 'axios';
import renderHTML from 'react-render-html';
import { Link, Redirect } from 'react-router-dom';
import RegisterStorage from "./stores/RegisterStorage";
import swal from "sweetalert2";
import './Register.css';
import './takephoto.css';
import web3 from './web3';
import VoterContract from './VoterContract';
var CryptoJS = require("crypto-js");

class TakeRegisterPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: this.props.location.state.password,
            username:this.props.location.state.username,
            fname: this.props.location.state.fname,
            lname: this.props.location.state.lname,
            dob: this.props.location.state.dob,
            gender: this.props.location.state.gender,
            email: this.props.location.state.email,
            metaaddress: '',
            privateKey: '',
            publicKey: ''
        }
        this.captureImage = this.captureImage.bind(this)
    }

    async captureImage() {
        if (!this.state.username)
        return;

        try{
                // console.log('in capture image ')
                // var data = {}
                // data.username= this.state.username

                // const response = await axios.post('http://localhost:5000/api/register',data)
            
                // console.log(" response.data" + response)
                // console.log(" response.data" + JSON.stringify(response.data))

                // let jsonres = response.data;
                // console.log("jres: " +jsonres);
                
                // let cont = jsonres.content;
                // console.log("cont: " + cont)

                // let fv = cont.feature_vector;
            
                // console.log("type1: " + typeof(fv));
                // console.log("Response from fr: "+fv);
               
            
                // let result = response.data.success;
                
                //     if (result) 
                  //  {
                        console.log("image upload success");
                        swal.fire({
                            icon: 'success',
                            title: 'Congrats!! Image Taken!',
                            text: 'You have succesfully uploaded your image!',
                            confirmButtonText: "OK"
                        });

                        //create metamask account
                        console.log("creating an account..");
                        var responsemeta = await web3.eth.accounts.create(web3.utils.randomHex(32));
                        console.log("responsemeta: "+responsemeta);
                        this.state.metaaddress = responsemeta.address;
                        console.log(this.state.metaaddress);
                        this.state.privateKey = responsemeta.privateKey;
                        console.log(this.state.privateKey);
                        

                        swal.mixin({
                            confirmButtonText: 'Next &rarr;',
                            showCancelButton: true,
                            progressSteps: ['1', '2']
                        }).queue([
                            {
                                title: 'Step 1',
                                text: 'Kindly safely save the private key displayed in next step. It is required for login.'
                            },
                            {
                                title: 'Step 2',
                                text: this.state.privateKey
                            }
                        ]).then((result) => {
                            if (result.value) {
                            const answers = JSON.stringify(result.value)
                            swal.fire({
                                title: 'All done!',
                                confirmButtonText: 'Lovely!'
                            })
                            }
                        })

                        //store information in DB
                        try {
                            let res = await fetch('http://localhost:3003/voterinfopost', {
                                method: 'post',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    password: this.state.password,
                                    username:this.state.username,
                                    metamaskaddrss: this.state.metaaddress
                                })
                            });
                            
                            let result = await res.json();
                            console.log("response from db: ", result);

                            if(result.msg == "Username already taken")
                            {
                                swal.fire({
                                    icon: 'error',
                                    title: 'Username is taken',
                                    text: 'Try Again',
                                    confirmButtonText: "OK"
                                });
                                this.props.history.push("/RegisterInfo");
                            }

                            if (result && result.success) {
                                //send information to blockchain
                                console.log("Voterid is : "+result.voterid);
                                  var featureVector = "[-0.026053009727038442, 0.15075167000293732, 0.056840124129084874, 0.13072286173701286, 0.031368514124769716, 0.17485265031456948, 0.026036462942138315, -0.15000932678580284, 0.026525200966279954, 0.041824865166563543, 0.023493123591179027, 0.016195070333778858, -0.03132371820800472, -0.11433402203023434, 0.05289670690894127, 0.03668313853442669, -0.009506147522479295, 0.1222660407423973, -0.04868937355233356, -0.04474613660946489, 0.052147776954807344, -0.05275954557582736, -0.02444938982487656, 0.096379489954561, 0.10348723955452442, -0.06408110213465988, -0.1373983906209469, -0.10776561334729194, 0.02894978958182037, 0.0766159513220191, 0.15818112686276437, 0.2281595580279827, -0.05162701521068811, 0.0930608456581831, 0.0970461630821228, 0.0657275614142418, 0.018382330257445574, -0.029534526634961367, 0.04452831541653723, -0.09417276695370674, 0.07738524563610553, -0.12633040219545363, 0.04994632537476718, -0.06905871148221195, 0.019391544435638935, -0.043886448480770925, 0.0927432955801487, 0.021635680759791286, -0.14338846191763877, -0.08279495883733035, 0.07110752122942358, 0.006719377518165857, 0.06898875164799392, -0.09634707495570183, 0.027052232841961087, 0.1137135761976242, -0.06861873772693798, 0.04335911061090883, -0.030104315523058176, -0.03220944156113546, -0.11181822314858436, 0.024334094151854516, 0.05972563771065324, -0.24802100479602815, 0.1731882743537426, 0.11389585822820664, 0.0026230946759460494, -0.09616105115041136, -0.237820887863636, 0.18267094433307648, -0.07186868447810411, 0.05846655703149736, -0.10829842559993268, 0.02567508081032429, -0.02074729474097694, -0.05343594083562493, 0.05554653663188219, 0.019599515942391007, -0.04109618331771344, -0.032753658844158054, -0.07138129595667124, 0.07980808287858963, -0.04745268542319536, -0.062110643214546145, -0.0487545807112474, -0.04590106926392764, -0.031276981900446116, -0.05975009130313993, -0.059101097586099056, 0.12414395444095135, 0.07365519478917122, -0.05549014636315405, -0.008778482545167207, 0.01807546407682821, 0.029356441106647254, 0.09675576031208039, -0.005981170198647305, 0.03289733230601996, 0.03297194209881127, 0.043707616459578276, 0.04224407441914082, -0.02428804671857506, -0.11145847991108894, 0.05473561081569642, 0.053805233801249415, 0.07129376471042632, 0.04562839126447216, -0.04254542816895992, 0.028919321247376503, 0.015321260574855841, -0.11880014650523663, 0.0669758278504014, -0.024308743935544042, -0.0718711955845356, 0.1488288350403309, -0.07876925777643919, -0.04420450812438503, -0.032954031429253516, 0.11168285958468914, 0.12905490383505822, 0.14653940960764886, -0.030435446085466538, 0.033497215113602576, 0.03103744749794714, 0.058833220303058625, 0.09757829710841179, 0.09236186929047108, -0.08559191657230258]";
                               
                                var voterinfo = {
                                        fv: featureVector,
                                        password: this.state.password,
                                        username: this.state.username,
                                        fname: this.props.location.state.fname,
                                        lname: this.props.location.state.lname,
                                        dob: this.props.location.state.dob,
                                        gender: this.props.location.state.gender,
                                        id: result.msg
                                }

                                console.log("Type of private key var in register: "+ typeof(this.state.privateKey));
                                var voterinfocipher = CryptoJS.AES.encrypt(JSON.stringify(voterinfo), this.state.privateKey);
                                console.log("Encrypted info: ", voterinfocipher.toString());

                                var starttime =Date.now();
                                console.log("start time", starttime);
                                //store ciphertext on blockchain
                                var accounts = await web3.eth.getAccounts();
                                console.log("web3", accounts);
                                console.log("aing: "+ accounts[0]);
                                web3.eth.defaultAccount = accounts[0];
                                
                                await VoterContract.methods.register(result.voterid, voterinfocipher.toString()).send({from: accounts[0]});
                                var totaltime = (Date.now() - starttime)/1000;
                                console.log("total time", totaltime);
                                swal.fire({
                                    icon: 'success',
                                    title: 'Congratulations!',
                                    text: 'Voter information stored on blockchain',
                                    confirmButtonText: "OK"
                                });
                                
                                this.props.history.push("/Login");
                            }
                
                            else if (result && result.success === false) {
                                console.log("registration failed ")
                                swal.fire({
                                    icon: 'error',
                                    title: 'Failed to store registration data in database',
                                    text: 'Try Again',
                                    confirmButtonText: "OK"
                                });
                                this.props.history.push("/RegisterInfo");
                            }
                        }
                        catch (e) {
                
                    }
                    // }
                    // else{
                    //     console.log("image upload failed");
                    // }
                
        }catch(e){

        }
    }

    render() {
      return (
       
 <div className ="container">
        <div className= "header">
            <li className="nav-item">
                <a className=" brand">Electronic Ballot</a>
            </li>
            <li className="nav-item">
                <a className="colorb">On BlockChain</a>
            </li>
            <Link to="/AdminLogin" className="nav-item nav-link admin" id="log"> Setup-Campaign
            </Link>
            <Link to="/RegisterInfo" className="nav-item nav-link reg" id="log"> Register
            </Link>
            <Link to="/Login" className="nav-item nav-link log" id="log"> Login
            </Link>
        </div>

    <div className="row">
        <div className="pitchline" id="pitch">
            <div id="Main">Online election perfection!</div>
            <div id="about">Our E-Voting solution is here for you.</div>
        </div>
    </div>  

    <div className="row">
            <div className="information" >
                <div className="registerimagever col-md-6"></div>
                <div className="qoutetakephoto">
                    <div className ="h3" className="since-title"> Helping People Connect
                        <br></br>Since 2020
                        <p>Security & Trust</p>
                    </div>
            </div>
            </div>
            <div className="canvasphoto" id="canvas" >
            <div className="phototext">Photo:</div>
                    <video className="videoclass" id="videoForImage" autoPlay width="250px" height="200px"></video>
                    <div></div>
                    <button className="btn" id="capture" onClick={this.captureImage}>Capture</button>
            </div>
    </div>
    </div>   
      );
    }
  }
  //Export The Main Component
  export default TakeRegisterPhoto;
  