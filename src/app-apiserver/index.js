import appContracts from 'app-contracts';
import Web3 from 'web3';
import dispatch from 'micro-route';

const provider = new Web3.providers.HttpProvider(`http://localhost:8545`)   
const web3Provider = new Web3(provider);

appContracts.setProvider(web3Provider.currentProvider);

module.exports = dispatch()
  .dispatch('/', 'GET', (req, res) => "hello word")