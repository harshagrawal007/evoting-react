import React from "react";
import { useHistory } from "react-router";
import "./Candidate.css";


const CandidateDetail = (props) => {
  const history = useHistory();
  const candidate = props.history.location.state.candidateDetails[0];
  return (
      <React.Fragment>
       <div className= "header">
                <ul className="navbar-nav" id="navg">
                    <li className="nav-item">
                        <a className=" brand">Electronic Ballot</a>
                    </li>
                    <li className="nav-item">
                        <a className=" colorb">On BlockChain</a>
                    </li>
                </ul>
        </div>
        <div className="row candidateindetail">
          <div className="col-md-4">
            <img className="profileimg" src='https://react.semantic-ui.com/images/avatar/large/matthew.png' alt="avatar" style={{width:'200px'}} />
          <span ></span>
                                                  
          </div>
          <div className="col-md-4">
          <h2>
              <label htmlFor="long">Information</label>
              </h2>
            <div>
              <span className="candidate">{candidate.candidate_info}</span>
            </div>
          </div>
          <div className="col-md-4">
            <h2>
              <label htmlFor="long">Details</label>
            </h2>
            <div>
              <span className="candidate">{candidate.candidate_desc}</span>
            </div>
          </div>
          <div className="">
            <button className="btn goback" onClick={() => history.goBack()}>
              Go Back
            </button>
          </div>
        </div>
        {/* <Footer /> */}
      </React.Fragment>
  );
};
export default CandidateDetail;