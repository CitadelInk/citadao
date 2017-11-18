//var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Ink = artifacts.require('./Ink.sol')



module.exports = function (deployer, done, accounts) {
  
  //var names = ["Account 1X"];
  //names.forEach(function(entry, index) {
  Ink.deployed().then(function(instance)  {

    instance.getAuthorgPostKey(accounts[0], 0).then((result) => {
      console.log("getAuthorgPostKey result[0] - " + result[0]);
      console.log("getAuthorgPostKey result[1] - " + result[1]);
      console.log("getAuthorgPostKey result[2] - " + result[2]);
      const state = {
        "document": {
          "data":{},
          "kind":"document",
          "nodes":[{
            "data":{
              "authorg":result[0],
              "submission":result[1],
              "revision":result[2],
              "index":0
            },
            "kind":"block",
            "isVoid":true,
            "type":"ref",
            "nodes":[{
              "kind":"text",
              "ranges":[{"kind":"range","marks":[],"text":" "}]}
              ]
            },
            {"data":{},
            "kind":"block",
            "isVoid":false,
            "type":"paragraph",
            "nodes":[{
              "kind":"text",
              "ranges":[{
                "kind":"range",
                "marks":[],
                "text":"Thanks for the great advice! This is what it looks like when you reference a post! It will show up as a mention on that post as well."
              }]
            }]
          }]
        },
        "kind":"state"
      }
      

      var postJson = {"authorg" : accounts[1], "text" : state}
      web3.bzz.put(JSON.stringify(postJson), (error, hash2) => {
        var revHash = '0x' + hash2;
        instance.submitSubmissionWithReferences.sendTransaction(revHash, [], [], [], {from : accounts[1], gas : 800000, gasPrice : 1000000000}).then((tx_id_2) => {
          var submissionEvent = instance.RevisionPosted({_authorg : accounts[1]});
          submissionEvent.watch(function(error2, result2) {
            if (!error2 && result2.transactionHash === tx_id_2) {
              console.log("success 2!");
            }
          })
        })
      })
    })
  });
}