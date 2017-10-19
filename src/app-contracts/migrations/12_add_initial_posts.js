//var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Ink = artifacts.require('./Ink.sol')
//const state = {"document":{"data":{},"kind":"document","nodes":[{"data":{"authorg":"0x225914af1b980cf2d0edbfb03190d7bd0aa8134f","submission":"0x2d3ea30347f01cb1587038c5ee45f27c6b6fe4dcab694ef7ba677471372df163","revision":"0x2d3ea30347f01cb1587038c5ee45f27c6b6fe4dcab694ef7ba677471372df163","index":0},"kind":"block","isVoid":true,"type":"ref","nodes":[{"kind":"text","ranges":[{"kind":"range","marks":[],"text":" "}]}]},{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","marks":[],"text":"Thanks for the great advice! This is what it looks like when you reference a post! It will show up as a mention on that post as well."}]}]}]},"kind":"state"}



module.exports = function (deployer, done, accounts) {
  //var names = ["Account 1X"];
  //names.forEach(function(entry, index) {
  Ink.deployed().then(function(instance)  {
    instance.getAuthorgPostKey(accounts[0], 0).then((result1) => {
      instance.getAuthorgPostKey(accounts[1], 0).then((result2) => {
        console.log("getAuthorgPostKey result1[0] - " + result1[0]);
        console.log("getAuthorgPostKey result1[1] - " + result1[1]);
        console.log("getAuthorgPostKey result1[2] - " + result1[2]);
        console.log("getAuthorgPostKey result2[0] - " + result2[0]);
        console.log("getAuthorgPostKey result2[1] - " + result2[1]);
        console.log("getAuthorgPostKey result2[2] - " + result2[2]);
        //const state = {"document":{"data":{},"kind":"document","nodes":[{"data":{"authorg":result[0],"submission":result[1],"revision":result[2],"index":0},"kind":"block","isVoid":true,"type":"ref","nodes":[{"kind":"text","ranges":[{"kind":"range","marks":[],"text":" "}]}]},{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","marks":[],"text":"Thanks for the great advice! This is what it looks like when you reference a post! It will show up as a mention on that post as well."}]}]}]},"kind":"state"}
        

      //var postJson = {"authorg" : accounts[1], "text" : state}
      //web3.bzz.put(JSON.stringify(postJson), (error, hash2) => {

        var subHash = result2[1];
        var revHash = result2[2];

        /*var refKeyAuths = [];
        var refKeySubs = [];
        var refKeyRevs = [];*/

        var refAuth = result1[0];
        var refSub = result1[1];
        var refRev = result1[2];

        /*refKeyAuths.push(auth);
        refKeySubs.push(sub);
        refKeyRevs.push(rev);*/

        
        /*console.log("typeOf auth = " + (typeof auth));
        console.log("typeOf sub = " + (typeof sub));
        console.log("typeOf rev = " + (typeof rev));

        console.log("sent transaction refKeyAuths: " + refKeyAuths);
        console.log("sent transaction refKeyAuths.length: " + refKeyAuths.length);
        console.log("sent transaction refKeySubs: " + refKeySubs);
        console.log("sent transaction refKeyRevs: " + refKeyRevs);

        console.log("typeOf refKeyAuths = " + (typeof refKeyAuths));
        console.log("typeOf refKeySubs = " + (typeof refKeySubs));
        console.log("typeOf refKeyRevs = " + (typeof refKeyRevs));*/

        //console.log("accounts[1] = " + accounts[1]);

        instance.respondToAuthorgSubmissionRevision.sendTransaction(refAuth, refSub, refRev, subHash, revHash, {from : accounts[1], gas : 800000, gasPrice : 1000000000}).then((tx_id_2) => {
          console.log("some kind of success");
          //var submissionEvent = instance.RevisionPosted({_authorg : accounts[1]});
          //submissionEvent.watch(function(error2, result2) {
          //  if (!error2 && result2.transactionHash === tx_id_2) {
          //    console.log("success 2!");
          //  }
          //})
        })
      })
    })
  })
  //});
}