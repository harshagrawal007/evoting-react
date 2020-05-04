const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'celery able setup trust oak beauty blame anger toast coffee length exhaust',
  'https://rinkeby.infura.io/v3/f2f49ec2616e4b899010b0b935404e48'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ gas: '2000000', from: accounts[0] });
  
  console.log(interface);
  console.log('Contract deployed to', result.options.address);
};
deploy();
