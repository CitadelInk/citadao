var Citadel = artifacts.require('./Citadel.sol')

module.exports = function (deployer, done, accounts) {
  var reactions = ["high quality", "informative", "low quality", "spam"];
  reactions.forEach(function(entry) {
    Citadel.deployed().then(function(instance)  {
      web3.bzz.put(entry, (error, hash) => {
        instance.addApprovedReaction.sendTransaction('0x' + hash, {from : accounts[0], gas : 200000, gasPrice : 1000000000});
      });
    });
  });  
}