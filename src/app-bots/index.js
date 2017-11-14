const RepostBot = require('./bots/repostBot');
const config =  require('./config.json');
const Web3 = require('web3');
const appContracts = require('app-contracts');

const provider = new Web3.providers.HttpProvider(`http://localhost:8545`)
const web3Provider = new Web3(provider);
console.log("web3Provider: " + web3Provider);
console.log("web3Provider.currentProvider: " + web3Provider.currentProvider);
console.log("web3Provider.currentProvider.isConnected(): " + web3Provider.currentProvider.isConnected());
appContracts.setProvider(web3Provider);

web3Provider.eth.getAccounts((error, accounts) => {
  if (error) {
    console.error(error);
  } else if (accounts) {
    console.log("accounts: " + accounts)
    for(i = 0; i < config.bots.length; i++) { 
      var r = new RepostBot(accounts[config.bots[i].ethAccountIndex], config.bots[i].twitterUsername, web3Provider, appContracts);
    }    
  }
});


