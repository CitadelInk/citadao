var Ink = artifacts.require('./Ink.sol')

module.exports = function (deployer, done, accounts) {
  Ink.deployed().then(function(instance)  {
    var bioInput = {"name":"2nd Account 2000"}
    web3.bzz.put(JSON.stringify(bioInput), (error, hash) => {
      instance.submitBioRevision.sendTransaction('0x' + hash, {from : accounts[1], gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
        var bioSubmissionEvent = instance.BioUpdated({_authorg : accounts[1], _subHash : '0x' + hash});
        bioSubmissionEvent.watch(function(error,result){
          if (!error && result.transactionHash === tx_id) {
            console.log("success 1!");
          }
        })
      });
    });
  }); 
}