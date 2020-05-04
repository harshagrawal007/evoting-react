pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;


contract VoterContract   {
  
    struct Voter {
        address voterAddress;
        uint user_id;
        string hash;
        bool hasvoted;
    }

      struct Candidate {
        uint candidate_id;
        string first_name;
        string last_name;
        string candidate_info;
        string candidate_desc;
        uint voteCount;
    }
    
    mapping(uint  => Voter) public voters;
    mapping(uint  => bool) public voterVoted;
    mapping(address => uint) public addressVote;
    mapping(uint  => Candidate) public candidates;

    // Store Voters Count
    uint public count;
    
    function register(uint id,string  memory _hash) public {
        Voter memory voter = Voter(msg.sender,id,_hash,false);
        voters[id] = voter;
    }
    
    function getVoterInformation(uint _user_id) public view returns (Voter memory) {
        return voters[_user_id];
    }
    
    function getVoterCount() public view returns (uint){
        return count;
    }
    
    function  getVoterList () public view returns (Voter[] memory){
        Voter[] memory list = new Voter[](count);
        for(uint i =0 ; i < count; i++){
            list[i] = voters[i];
        }
        return list;
    }

    function userVoted(uint _user_id) public view returns (bool){
        return voterVoted[_user_id];
    }

    function vote (uint _candidateId, uint _user_id) public view{
        if(addressVote[msg.sender]!=1)
        {
            addressVote[msg.sender] = 1;
            candidates[_candidateId].voteCount++;
            voterVoted[_user_id] = true;
        }
    }

    function addCandidate(uint candidate_id,string memory _first_name,string memory _last_name,string memory _candidate_info,
                            string memory _candidate_desc) public{
        Candidate memory candidate = Candidate(candidate_id,_first_name,_last_name,_candidate_info,_candidate_desc,0);
        candidates[candidate_id] = candidate;
    }

    function getCandidateInformation(uint candidate_id) public view returns (Candidate memory) {
        return candidates[candidate_id];
    }

    // function getCandidates(uint count, uint startfrom) public view returns (Candidate[] memory){
    //     Candidate[] memory candidateList = new Candidate[](count);
    //     uint j = 0;
    //     for (uint i = startfrom; i < startfrom+count; i++) {
    //       candidateList[j] = candidates[i];
    //       j = j+1;
    //     }
    //   return candidateList;
    // }
}