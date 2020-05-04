const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const options = { gasLimit: 18000000 };
const provider = ganache.provider(options);
const web3 = new Web3(provider);
const {interface, bytecode} = require('../src/compile');

let accounts;
let voterContract;

// class Car{
//     park(){
//         return "Parked";
//     }
// }

// describe('car test', ()=> {
//     it('can it park',  ()=>{
//         const car = new Car();
//         assert.equal(car.park(), 'Parked');
//     });
// });

beforeEach(async()=> {
    accounts = await web3.eth.getAccounts();

    voterContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({ from: accounts[0], gas: '10000000' });
});

describe('voterContract accounts', ()=>{
    //verfiy that we got an account address assigned
    it('deploys a contract', async ()=>{
        assert.ok(voterContract.options.address);
        await voterContract.methods.register(19,"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").send({ from: accounts[0] });
    });
    
    // it('verify vote and winner', async () => {
    //     const voter = await voterContract.methods.getVoterInformation.call();
    //     console.log(voter);
    //     assert.equal(voter.id, 19);
    //   });
});