const RepostBot = require('./bots/repostBot');
const config =  require('./config.json');
const Web3 = require('web3');
const appContracts = require('app-contracts');

var provider = new Web3.providers.HttpProvider(`http://localhost:8545`);
var web3Provider = new Web3(provider);
appContracts.setProvider(web3Provider.currentProvider);

web3Provider.eth.getAccounts((error, accounts) => {
  if (error) {
    console.error(error);
  } else if (accounts) {
    //console.log("accounts: " + accounts)
    for(i = 0; i < config.bots.length; i++) { 
      //console.log("account: " + accounts[config.bots[i].ethAccountIndex]);
      var r = new RepostBot(accounts[config.bots[i].ethAccountIndex], config.bots[i].twitterUsername, web3Provider, appContracts);
    }    
  }
});


