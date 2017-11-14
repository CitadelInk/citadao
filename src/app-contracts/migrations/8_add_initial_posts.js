var Ink = artifacts.require('./Ink.sol')

module.exports = function (deployer, done, accounts) {
  console.log("Ink: " + Ink);
  console.log("migration Ink.deployed(): " + Ink.deployed());
  Ink.deployed().then(function(instance)  {
    var bioInput = {"name":"Account 1X"}
    web3.bzz.put(JSON.stringify(bioInput), (error, hash) => {
      instance.submitBioRevision.sendTransaction('0x' + hash, {from : accounts[0], gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
        var bioSubmissionEvent = instance.BioUpdated({_authorg : accounts[0], _subHash : '0x' + hash});
        bioSubmissionEvent.watch(function(error,result){
          if (!error && result.transactionHash === tx_id) {
            console.log("success 1!");
          }
        })
      });
    });
  }); 
}