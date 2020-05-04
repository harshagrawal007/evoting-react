import React, { Component } from "react";
import axios from "axios";
import swal from "sweetalert2";
import web3 from './web3';
import { Button, Modal } from 'react-bootstrap';
import VoterContract from './VoterContract';
import './camp.css';
import classnames from 'classnames'
import { Card, Icon, Image } from 'semantic-ui-react';
import Listing from './Listing';

class CandidateList extends Component {
    constructor(props){
    super(props);
    this.state= {
        candidates:[],
        candidates2:[],
        first_name:"",
        last_name:"",
        candidate_info:"",
        candidate_desc:"",
        voteCount:"",
        showmodel:false
    };
   this.onChange = this.onChange.bind(this);
    //this.showmodel =this.showmodel(this);
}
showmodel(){
    this.setState({
        showmodel: true
        // profile: this.props.getProfile
    });
    console.log(this.state.showmodel);
}

doLogout(){
    //UserStorage.username='';
    this.props.history.push("/Login");
}

hidemodel(){
    this.setState({
        showmodel: false
        // profile: this.props.getProfile
    });
}
     componentDidMount(){
        //debugger

         axios.get(`http://localhost:3003/candidatelist`)
        .then((response) => {
            //debugger
            console.log("response.data", response.data.data);
            //console.log(response.data.candidates[0]);
            //console.log(response.data.candidates[1]);
            
            this.setState({
                candidates: response.data.data,
                // profile: this.props.getProfile
            });
            console.log("candidates from state"+ this.state.candidates);
            
        });
        
    }

    onChange(e) {
        // debugger
    //    e.preventDefault();
    // console.log( e.target.value);
    this.setState({ [e.target.name]: e.target.value });
    }

    async settleElection()
    {
        const response = await fetch('http://localhost:3003/candidateCount', {
          method: 'get',
          headers: {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        });
        
        let result = await response.json();
        console.log("Count from DB is", result.data[0]);
        var count = result.data[0].count;
        console.log("count is: "+count);
        
        const responseStartFrom = await fetch('http://localhost:3003/getStartFrom', {
          method: 'get',
          headers: {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        });

        let resultStartFrom = await responseStartFrom.json();
        console.log("Startfrom from DB is", resultStartFrom.data[0]);
        var startfrom = resultStartFrom.data[0].candidate_id;
        console.log("Startfrom is: "+startfrom);

        var accounts = await web3.eth.getAccounts();
        console.log("web3", accounts);
        console.log("aing: "+ accounts[0]);
        web3.eth.defaultAccount = accounts[0];
           
        var canid;
        var canname;
        var max=0;
        for (var i = startfrom; i < startfrom+count; i++) {
          var blocandidate = await VoterContract.methods.getCandidateInformation(i).call();
          console.log("candidate recieved from blockchain: "+blocandidate);
          if(blocandidate.voteCount > max)
          {
            max = blocandidate.voteCount;
            canid = blocandidate.candidate_id;
            canname = blocandidate.first_name + " " +blocandidate.last_name ;
          }
        }
            swal.fire({
                icon: 'success',
                title: 'Election results are out!',
                text: canname + 'has won!',
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.value) {
                    window.location.reload();
                }
            })

            console.log("time stamp: "+Math.floor(Date.now() / 1000));

            const responseSettleElection = await fetch('http://localhost:3003/settleElection', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name:canname,
                    settled:1,
                    timestamp: Math.floor(Date.now() / 1000)
                })
              });
      
              let resultSettleElection = await responseSettleElection.json();
              if (resultSettleElection && resultSettleElection.success) {
                swal.fire({
                    icon: 'success',
                    title: 'Congratulations!',
                    text: 'Election results stored in database',
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.value) {
                        window.location.reload();
                    }
                })
              }
              else
              {
                swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Election results not stored in database',
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.value) {
                        window.location.reload();
                    }
                })
              }
    }

    async handleAddCandidate(e){
        //  e.preventDefault();
    try {
        let res = await fetch('http://localhost:3003/newcandidate', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name:this.state.first_name,
                last_name:this.state.last_name,
                candidate_info:this.state.candidate_info,
                candidate_desc:this.state.candidate_desc,
                voteCount:0
            })
        });
        
        let result = await res.json();
        console.log("response from db: ", result);

        if (result && result.success) {
            //send information to blockchain
            console.log("Voterid is : "+result.candidate_id);
            //creating fake file
             
                var id = result.candidate_id;
                var firstname= this.state.first_name;
                var lastname =this.state.last_name;
                var info=this.state.candidate_info;
                var desc=this.state.candidate_desc;
                var voteCount=0
           

            var accounts = await web3.eth.getAccounts();
            console.log("web3", accounts);
            console.log("aing: "+ accounts[0]);
            web3.eth.defaultAccount = accounts[0];
            console.log(id);
            
            await VoterContract.methods.addCandidate(id, firstname.toString(),lastname.toString(),
            info.toString(),desc.toString()).send({from: accounts[0]});
            
            console.log("Candidate Stored on blockchain..");
            const candidate = await VoterContract.methods.getCandidateInformation(id).call();
            console.log("Got the candidate information from blockchain: "+candidate);
           
            this.hidemodel();

            swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: 'Candidate stored on blockchain',
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.value) {
                    window.location.reload();
                }
              })
         
            this.props.history.push("/candidatelist");
        }

        else if (result && result.success === false) {
            console.log("Add candidate failed ")
            swal.fire({
                icon: 'error',
                title: 'Failed to store candidate data in database',
                text: 'Try Again',
                confirmButtonText: "OK"
            });

            this.props.history.push("/adminlogin");
        }
    }
    catch (e) {

    }
        //await this.props.handleAddEducation(newprofile);
    }
    
    render() {
        //debugger
        const columnClasses = classnames('column', 'col-4', 'col-xs-12')
        const cardClasses = classnames('card')

        let loopcandidate = this.state.candidates.map((candidate1, i) => {
            return (
        <div className="coloumns" key={i}>
            <div className={columnClasses}>
                    <Card>
                        <div >
                         <img className="profileimg" src='https://react.semantic-ui.com/images/avatar/large/matthew.png' alt="avatar" style={{width:'200px'}} />
                         <span ></span>                
                         </div>
                        <Card.Content class="textcan">
                            <Card.Header>{candidate1.first_name} {candidate1.last_name}</Card.Header>
                            <Card.Meta>
                            {candidate1.candidate_info}
                            </Card.Meta>
                            <Card.Description>
                            {candidate1.candidate_desc}
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                            Running For President
                            </a>
                        </Card.Content>
                    </Card>
                    </div>           
                </div>
            )
        })
        return (
            <div>
              
 <Modal show={this.state.showmodel} onHide={() => this.hidemodel()}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                <div className="row">
                    <div>
                        <div >
                            <div>
                                <input required className="candinfo" placeholder="First Name"name= "first_name" 
                                value={this.state.first_name} onChange={this.onChange} type="text" />
                            </div>
                        </div>
                        <div >
                            <div>
                                <input required className="candinfo" placeholder="Last Name" name= "last_name" 
                                value={this.state.last_name} onChange={this.onChange}type="text" />
                            </div>
                        </div>
                        <div >
                            <input required className="candinfo" placeholder="Any political experience?" name ="candidate_info" 
                            type="text" value={this.state.candidate_info} onChange={this.onChange} />
                        </div>
                        <div>
                            <textarea required className="candinfo"  placeholder="Add a short description" name = "candidate_desc" 
                            value={this.state.candidate_desc} onChange={this.onChange}  >
                            </textarea>
                        </div>
                    </div>
                </div>
                </Modal.Body>
          
                <Modal.Footer>
                <button className="rg addcandi" id="rg" onClick={() => this.handleAddCandidate()}>Add</button>
                </Modal.Footer>
                </Modal> 



            <div className="container">
            <div className= "header">
                        <ul className="navbar-nav" id="navg">
                            <li className="nav-item">
                                <a className=" brand">Electronic Ballot</a>
                            </li>
                            <li className="nav-item">
                                <a className="colorb">On BlockChain</a>
                            </li>
                            <li className="nav-item">
                            <button className="btnlogout" type="button"  onClick={() => this.doLogout()} >Logout </button>
                            </li>
                        </ul>
                    </div>

                <section className="mycard">
                    <header className="applicantheader">
                    <ul id="setcamp">
                    <li className="nav-item">
                        <h3 className="camp" >
                            Presidential Elections 2020 
                        </h3>     
                        <button className="btnsettle" type="button" onClick={() => this.settleElection()} >Settle Election</button>
                        <button className="btn can" type="button" data-toggle="modal" data-target="#addcandidate" onClick={() => this.showmodel()} >Add Candidate</button>
                    </li>
                    </ul>
                    </header>
                    <div className="columns">
                        {loopcandidate}
                    </div>
                </section>
            </div>
</div>


        );
    }
}

//Export The Main Component
export default CandidateList;