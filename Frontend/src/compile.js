const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'VoterContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

console.log(solc.compile(source,1));

module.exports = solc.compile(source, 1).contracts[':VoterContract'];
