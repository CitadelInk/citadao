//var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Ink = artifacts.require('./Ink.sol')
const state = {"document":{"data":{},"kind":"document","nodes":[{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","marks":[],"text":"This is what a test post looks like."}]}]}]},"kind":"state"}


module.exports = function (deployer, done, accounts) {
  //var names = ["Account 1X"];
  //names.forEach(function(entry, index) {
  Ink.deployed().then(function(instance)  {

    var postJson = {"authorg" : accounts[0], "text" : state}
    web3.bzz.put(JSON.stringify(postJson), (error, hash2) => {
      instance.submitRevision.sendTransaction('0x' + hash2, '0x' + hash2, {from : accounts[0], gas : 400000, gasPrice : 1000000000}).then((tx_id_2) => {
        var submissionEvent = instance.RevisionPosted({_authorg : accounts[0]});
        submissionEvent.watch(function(error2, result2) {
          if (!error2 && result2.transactionHash === tx_id_2) {
            console.log("success 2!");
          }
        })
      })
    })
  });
}