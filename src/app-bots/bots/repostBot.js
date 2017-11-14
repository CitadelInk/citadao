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
                this.checkBio()
            }
        })
    }

    checkBio() {
        console.log("check bio 1. appContracts = " + appContracts)
        console.log("check bio 1. appContracts.Ink = " + appContracts.Ink)
        console.log("check bio 1. appContracts.Ink.deployed() = " + appContracts.Ink.deployed())
        appContracts.Ink.deployed().then(function(instance) {
            console.log("check bio 2.")
            instance.getBioRevisions(account) 
            .then((result) => {
                console.log("check bio 3.")
                var bioRevisions = result[0];
                if (bioRevisions.length > 0) {
                    console.log("already have bio.")
                    setInterval(this.checkTweets, 1000);
                } else {
                    console.log("set bio.")
                    var bioInput = {"name":instance.twitterScreenName + " REPOSTER"}
                    updateBio(bioInput, this.ethAccount, this.web3).then((result) => {
                        setInterval(this.checkTweets, 1000);
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
            appContracts.Ink.deployed()
            .then((instance) => {
              var subHash = '0x' + hash;
              instance.submitBioRevision.sendTransaction('0x' + hash, {from : account, gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
                var bioSubmissionEvent = instance.BioUpdated({_authorg : account, _subHash : subHash})
                bioSubmissionEvent.watch(function(error, result){
                    if(!error && result.transactionHash == tx_id) {
                        res({tx_id})
                    }
                })
              }).catch(rej);
            });
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
                var submissionEvent = instance.RevisionPosted({_authorg : account});
                
                submissionEvent.watch(function(error, result) {
                    if (!error && result.transactionHash == tx_id) {
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
                    var postJson = {"authorg" : this.ethAccount, "text" : state}
                    post(JSON.stringify(postJson), this.ethAccount, this.web3).then((result) => {
                        instance.seenTweets[data[i].id] = true;
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