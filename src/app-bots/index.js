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
    for(var i = 0; i < config.bots.length; i++) { 
      var r = new RepostBot(accounts[config.bots[i].ethAccountIndex], config.bots[i].twitterUsername, config.bots[i].twitterAvatarFilename, config.bots[i].avatarDataPrefix, web3Provider, appContracts);
    }    
  }
});


