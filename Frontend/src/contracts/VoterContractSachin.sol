pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;


contract VoterContract   {
    struct Voter {
        address voterAddress;
        uint user_id;
        string first_name;
        string last_name;
        string ssn;
        bool voted;
        string username;
        string password;
        string hash;
    }
    
    // Store Voters
    // Fetch Voters
    mapping(uint  => Voter) public voters;
    // Store Voters Count
    uint public count;
    
    function register(string memory _first_name,string memory _last_name,string memory _ssn,string memory _username,string memory _password,string  memory _hash) public {
        Voter memory voter = Voter(msg.sender,count,_first_name,_last_name,_ssn,false,_username,_password,_hash);
        voters[count] = voter;
        count++;
    }

    function 
    
    function userVoted(uint  _user_id) public {

        Voter storage voter = voters[_user_id];
        voter.voted = true;
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
    
    
    // function login(string memory _username,string memory _password) public view returns (bool){
    //     for(uint i =0; i < count; i++){
            
    //     }
    //     return false;
    // }
    
    
}