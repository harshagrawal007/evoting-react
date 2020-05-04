import React from "react";
import "./Candidate.css";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";

const Candidate = (props) => {
  const candidate = props.candidate;
  const full_name = candidate.first_name + " " + candidate.last_name;
  return (
      <React.Fragment>
        <div className="row candidateinvote">
          <div className="col-md-3">
              <div >
                <img className="profileimg" src='https://react.semantic-ui.com/images/avatar/large/matthew.png' alt="avatar" style={{width:'200px'}} />
                <span ></span>                                      
              </div>
          </div>
          <div className="col-md-3">
              <h2>{full_name}</h2>
          </div>
          <div className="col-md-3">
            <button
                className="btn showmore"
                onClick={(candidate_id) => props.showDetails(candidate.candidate_id)}
            >
              Show More
            </button>
          </div>
        </div>
      </React.Fragment>
  );
};

export default Candidate;