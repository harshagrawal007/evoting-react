import Web3 from 'web3';
var web3;

async function validate() 
{
        try
        {
            if (window.ethereum) 
            {
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
            }
            else if(window.web3.currentProvider)
            {
                web3 = new Web3(window.web3.currentProvider);
            }
        }
        catch(e)
        {
            console.log("In web3 module..");
            console.log("Metamask is not installed..");
        }
}

validate();
export default web3;

