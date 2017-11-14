var Twit = require('twit');
var fs = require('fs');
var appContracts = require('app-contracts');

//Bot that takes tweets and puts them up as Citadel posts.
class RepostBot {
    constructor(ethAccount, twitterScreenName, web3, appContracts) {
        this.T = new Twit({
            consumer_key:         'MbGCRjZCei8OFkTxzmtDbWTW1', 
            consumer_secret:      'eLYWY4cmwX88SzCyHKU2JW1o09ob2RTDs0a6uJBEaqZ1ArWExV',
            app_only_auth:        true
        });
        this.twitterScreenName = twitterScreenName;
        this.ethAccount = ethAccount;
        this.web3 = web3;
        this.appContracts = appContracts;
        this.checkTweets = this.checkTweets.bind(this);
        this.checkBio = this.checkBio.bind(this);

        var instance = this;

        fs.readFile(__dirname + "/botsPersistence/" + instance.twitterScreenName + ".txt", (err, data) => {
            try {
                instance.seenTweets = JSON.parse(data);
            } catch(ex) {
                console.log("error on load file. maybe no file yet.")
                instance.seenTweets = {};
            } finally {
                this.checkBio(ethAccount)
            }
        })
    }

    checkBio(account) {
        var classInstance = this;
        return appContracts.Ink.deployed().then(function(instance) {
            instance.getBioRevisions(account) 
            .then((result) => {
                var bioRevisions = result[0];
                if (bioRevisions.length > 0) {
                    setInterval(classInstance.checkTweets, 10000);
                } else {
                    var bioInput = {"name":classInstance.twitterScreenName + " REPOSTER"}
                    classInstance.updateBio(JSON.stringify(bioInput), account, classInstance.web3).then((result) => {
                        setInterval(classInstance.checkTweets, 10000);
                    })
                }
            })
        }, function(reason) {
            console.error("failed. reason: " + reason);
        })
    }

    updateBio(bioInput, account, web3) {
        return new Promise((res, rej) => {
          web3.bzz.put(bioInput, (error, hash) => {
              if (error) {
                console.log("error: " + error)
              } else {
                appContracts.Ink.deployed()
                .then((instance) => {
                  var subHash = '0x' + hash;
                  console.log("subHash: " + subHash);
                  console.log("account: " + account);
                  instance.submitBioRevision.sendTransaction(subHash, {from : account, gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
                    var bioSubmissionEvent = instance.BioUpdated({_authorg : account, _subHash : subHash})
                    console.log("have bioSubmissionEvent.")
                    bioSubmissionEvent.watch(function(error, result){
                        console.log("watch bioSubmission event.")
                        if(!error && result.transactionHash == tx_id) {
                            console.log("return res!")
                            res({tx_id})
                        }
                    })
                  }).catch(rej);
                });
              }
            
          });
        }); 
    };

    post(postInput, account, web3) {
        return new Promise((res, rej) => {
          web3.bzz.put(postInput, (error, hash) => {
            appContracts.Ink.deployed()
            .then((instance) => {
              var maxGas = 400000;
              var subHash = '0x' + hash;
              var revHash = '0x' + hash;
      
              instance.submitRevisionWithReferences.sendTransaction(subHash, revHash, [], [], [], {from : account, gas : maxGas, gasPrice : 1000000000}).then((tx_id) => {
                var submissionEvent = instance.RevisionPosted({_authorg : account, _subHash : subHash, _revHash : revHash});
                console.log("have submissionEvent.")
                submissionEvent.watch(function(error, result) {
                    console.log("watch submission event.")
                    if (!error && result.transactionHash == tx_id) {
                        console.log("return res!")
                        res({tx_id, submissionEvent, revHash, subHash});  
                    }
                })
              }).catch(rej);
            });
          });
        }); 
      }

    checkTweets() {       
        var options = { screen_name: this.twitterScreenName,
                        count: 5 };
        var instance = this;
        this.T.get('statuses/user_timeline', options , function(err, data) {
            for (var i = 0; i < data.length ; i++) {
                if(!instance.seenTweets[data[i].id]) {
                    console.log(data[i].id + " - " + data[i].text);
                    instance.seenTweets[data[i].id] = true;
                    const state = {
                        "document":{
                            "data":{},
                            "kind":"document",
                            "nodes":
                            [{
                                "data":{},
                                "kind":"block",
                                "isVoid":false,
                                "type":"paragraph",
                                "nodes":[{
                                    "kind":"text",
                                    "ranges":[{
                                        "kind":"range",
                                        "marks":[],
                                        "text": data[i].text
                                    }]
                                }]
                            }]
                        },
                        "kind":"state"
                    }
                    var postJson = {"authorg" : instance.ethAccount, "text" : state}
                    instance.post(JSON.stringify(postJson), instance.ethAccount, instance.web3).then((result) => {
                        console.log("finally lets save.")
                        
                        fs.writeFile(__dirname + "/botsPersistence/" + instance.twitterScreenName + ".txt", JSON.stringify(instance.seenTweets), (err) => {
                            if (err) throw err;
                            console.log("saved.")
                        });
                    })

                } else {
                    console.log("already seen.")
                }
            }

        })
    }



    // Here a tweet event is triggered!
    tweetEvent(tweet) {

        // If we wanted to write a file out
        // to look more closely at the data
        // var fs = require('fs');
        // var json = JSON.stringify(tweet,null,2);
        // fs.writeFile("tweet.json", json, output);

        // Who is this in reply to?
        var reply_to = tweet.in_reply_to_screen_name;
        // Who sent the tweet?
        var name = tweet.user.screen_name;
        // What is the text?
        var txt = tweet.text;
        // If we want the conversation thread
        var id = tweet.id_str;

        console.log("tweet text: " + txt);
    }
}

module.exports = RepostBot