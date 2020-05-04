import React, { Component } from "react";
import axios from "axios";
import UserStorage from './stores/UserStorage';
import VoterContract from './VoterContract';
import swal from "sweetalert2";
import Candidate from "./Candidate";
import Loader from "react-loader-spinner";
import web3 from './web3';
import Moment from 'react-moment';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import './App.css';

const style = {
  width: "30%",
  marginLeft: "0%",
  height: "50px",
  marginTop: "40px",
  marginBottom: "30px",
  fontSize: "20px",
  border: "none",
  borderRight: "solid #2eca6a 3px",
  borderBottom: "solid #2eca6a 3px",
  borderTop: "solid 3px lightgrey",
  borderLeft: "solid 3px lightgrey",
};

class Welcome extends Component {
    constructor(props){
        super(props);
        this.state={
            candidates: [],
            candidate_id:0,
            max_id:'',
            loading: true,
            success: null,
            username : '',
            password : '',
            buttonDisabled : false
        }
        this.handleCandidateChange = this.handleCandidateChange.bind(this);
        this.vote= this.vote.bind(this);
      }
    

    doLogout(){
        UserStorage.username='';
        this.props.history.push("/Login");
    }
    async componentDidMount(){
        const responseSettled = await fetch('http://localhost:3003/electionSetteled', {
          method: 'get',
          headers: {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        });
        
        let resultsEleSet = await responseSettled.json();
        
        if(resultsEleSet.data[0]!=undefined)
        {
          swal.fire({
            icon: 'success',
            title: "Results are out!",
            text: "And the winner is: "+ resultsEleSet.data[0].winner,
            type: "Success",
            confirmButtonText: "OK"
          });
          this.props.history.push("/Login");
        }

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
           
        let candidates2 = [];
        var j = 0;
        for (var i = startfrom; i < startfrom+count; i++) {
          candidates2[j] = await VoterContract.methods.getCandidateInformation(i).call();
          console.log("candidate recieved from blockchain: "+candidates2[j]);
          j = j+1;
        }

        this.setState({ candidates: candidates2, loading: false });
           
      };
      handleCandidateChange(event) {
        this.setState({ candidate_id: event.target.value });
      }
      showDetails = (candidate_id) => {
        if (candidate_id) {
          const candidate = this.state.candidates.filter(
            (candidate) => candidate.candidate_id === candidate_id
          );
          this.props.history.push({
            pathname: "/CandidateDetail",
            state: { candidateDetails: candidate },
          });
        }
      };

      async vote() {
        console.log("voter id used for storing vote on blockchain: "+this.state.candidate_id);
        if (this.state.candidate_id !== 0) {
          let res = await fetch('http://localhost:3003/getVoterId', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.props.location.state.username,
                    })
                });

                let result2 = await res.json();
                if (result2 && result2.success){
                    var voterid = result2.voterid;
                    
                        var accounts = await web3.eth.getAccounts();
                        console.log("web3", accounts);
                        console.log("aing: "+ accounts[0]);
                        web3.eth.defaultAccount = accounts[0];
                        var starttime =Date.now();
                        console.log("start time", starttime);
                        //check if user has voted
                        const voter = await VoterContract.methods.getVoterInformation(voterid).call();
                        console.log("Got the voter from blockchain: "+voter);
                        var hasvoted = await VoterContract.methods.userVoted(voterid).call();
                        console.log("has user voted?: "+hasvoted);

                        if(hasvoted > 0)
                        {
                          var totaltime = (Date.now() - starttime)/1000;
                          console.log("total time", totaltime);
                          swal.fire({
                          icon: 'error',
                          title: 'Voting failed',
                          text: 'Vote from this metamask address has already been casted at '+ moment(hasvoted*1000).format('MMMM Do YYYY, h:mm:ss a'),
                          confirmButtonText: "OK"
                      });
                        }
                        else{

                          await VoterContract.methods.vote(this.state.candidate_id, voterid).send({from: accounts[0]});
                          var totaltime = (Date.now() - starttime)/1000;
                              console.log("total time", totaltime);
                          swal.fire({
                            icon: 'success',
                            title: "Voting SuccesFull!",
                            text: "You have succesfully voted your candidate",
                            type: "Success",
                            confirmButtonText: "OK"
                          });
                         
                        }
                }
        } else {
            swal.fire({
                icon: 'error',
                title: 'Voting failed',
                text: 'Please Select a Candidate',
                confirmButtonText: "OK"
            });
        }
      }

    render() {
        const { loading, candidates } = this.state;
    let dropDown = null;
    let button = null;
    let ui = null;
    if (loading && candidates.length ==0) {
      ui =   <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000}
    />;
    }
    if(candidates.length ==0){
      ui = <div>No candidates to load Kindly add candidate info</div>
    }
    if(candidates.length !=0){
      ui = candidates.map((candidate) => {
        return (
          <Candidate
            showDetails={this.showDetails}
            key={candidate.candidate_id}
            candidate={candidate}
          />
        );
      });
      
      dropDown =  (
        <select style={style} onChange={this.handleCandidateChange}>
          <option>Select Candidate for Vote</option>
          {candidates.map((candidate) => (
            <option key={candidate.candidate_id} value={candidate.candidate_id}>
              {candidate.first_name + " " + candidate.last_name}
            </option>
          ))}
        </select>
      );
        button = (
        <div>
          <button className="btn vote" onClick={this.vote}>
            Vote
          </button>
        </div>
      );
    
    }

        return ( 
            <div className="container">
                        <div className= "header">
                        <ul className="navbar-nav" id="navg">
                            <li className="nav-item">
                                <a className=" brand">Electronic Ballot</a>
                            </li>
                            <li className="nav-item">
                                <a className=" colorb"> On BlockChain</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/welcome" className="nav-link welcome"> Welcome
                            </Link>
                           </li>
                           <li className="nav-item">
                                <Link to="/welcome" className="nav-link user uname"> {this.props.location.state.username}
                            </Link>
                           </li>
                        </ul>
                    </div>
                    <div className="row">
        {dropDown}
        {button}
        {ui}
      </div>
      </div>
      ); 
    }
}
  //Export The Main Component
  export default Welcome;