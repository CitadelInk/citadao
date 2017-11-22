var Twit = require('twit');
var fs = require('fs');
var appContracts = require('app-contracts');
var url = require('is-url');

//Bot that takes tweets and puts them up as Citadel posts.
class RepostBot {
    constructor(ethAccount, twitterScreenName, avatarFilename, avatarDataPrefix, web3, appContracts) {
        this.T = new Twit({
            consumer_key:         'MbGCRjZCei8OFkTxzmtDbWTW1', 
            consumer_secret:      'eLYWY4cmwX88SzCyHKU2JW1o09ob2RTDs0a6uJBEaqZ1ArWExV',
            app_only_auth:        true
        });
        this.twitterScreenName = twitterScreenName;
        this.ethAccount = ethAccount;
        this.avatarFilename = avatarFilename;
        this.avatarDataPrefix = avatarDataPrefix;
        this.web3 = web3;
        this.appContracts = appContracts;
        this.checkTweets = this.checkTweets.bind(this);
        this.checkBio = this.checkBio.bind(this);
        this.tweetsIndex = -1;
        var instance = this;        
        
        var botPath = ("production" === process.env.NODE_ENV) ? "./botsPersistence/" : __dirname + "/botsPersistence/"        

        fs.readFile(botPath + instance.twitterScreenName + ".txt", (err, data) => {
            try {
                var json = JSON.parse(data);
                var seenTweets = json.seenTweets;
                if (!seenTweets) {
                    seenTweets = {}
                }
                var tweetMap = json.tweetMap;
                if (!tweetMap) {
                    tweetMap = {}
                }
                var submissionMap = json.submissionMap;
                if (!submissionMap) {
                    submissionMap = {}
                }
                var revisionMap = json.revisionMap;
                if (!revisionMap) {
                    revisionMap = {}
                }

                instance.persistence = {
                    seenTweets : seenTweets,
                    tweetMap : tweetMap,
                    revisionMap : revisionMap,
                    submissionMap : submissionMap
                }
            } catch(ex) {
                console.log("error on load file. maybe no file yet. ex: " + ex);
                instance.persistence = {
                    seenTweets : {},
                    tweetMap : {},
                    submissionMap : {},
                    revisionMap : {}
                }
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
                    classInstance.checkTweets();
                    setInterval(classInstance.checkTweets, 120000);
                } else {

                    var filePath = ("production" === process.env.NODE_ENV) ? "./botAvatars/" : __dirname + "/botAvatars/"

                    fs.readFile( filePath + classInstance.avatarFilename, (err, data) => {
                        var bufferedData = Buffer.from(data).toString('base64');
                        bufferedData = classInstance.avatarDataPrefix + bufferedData;

                        var state = {
                            "document":{
                                "data":{},
                                "kind":"document",
                                "nodes":[]
                            },
                            "kind":"value"
                        }
                        state.document.nodes.push({
                            "data":{},
                            "kind":"block",
                            "isVoid":false,
                            "type":"paragraph",
                            "nodes":[{
                                "kind":"text",
                                "leaves":[{
                                    "kind":"leaf",
                                    "marks":[],
                                    "text": "I am a bot that reposts @" + classInstance.twitterScreenName + ". I do not repost Retweets or Replies to other users, only standalone"
                                }]
                            }]
                        })

                        var bioInput = {"name":"@" + classInstance.twitterScreenName + " REPOSTER", "image" : bufferedData, "text" : state}
                        classInstance.updateBio(JSON.stringify(bioInput), account, classInstance.web3).then((result) => {
                            classInstance.checkTweets();
                            setInterval(classInstance.checkTweets, 120000);
                        })
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
                    var revHash = '0x' + hash;
                    instance.submitBioRevision.sendTransaction(revHash, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
                        var bioSubmissionEvent = instance.BioUpdated({_authorg : account}, {fromBlock:0}, function(error, result){
                            if(!error && result.transactionHash == tx_id) {
                                res({tx_id})
                            }
                        })               
                    });
                }).catch(rej)
              }
            
          });
        }); 
    };

    post(postInput, account, web3, tweetId, submissionIndex = undefined) {
        var classInstance = this;
        return new Promise((res, rej) => {
          web3.bzz.put(postInput, (error, hash) => {
            appContracts.Ink.deployed()
            .then((instance) => {
                var maxGas = 400000;
                var revHash = '0x' + hash;
                console.log("before if else.")
                if(submissionIndex) {
                    instance.submitRevisionWithReferences.sendTransaction(submissionIndex, revHash, [], [], [], {from : account, gas : maxGas, gasPrice : 1000000000}).then((tx_id) => {
                        var submissionEvent = instance.RevisionPosted({_authorg : account, _subIndex : submissionIndex, _revHash : revHash});
                        submissionEvent.watch(function(error, result) {
                            if (!error && result.transactionHash == tx_id) {
                                classInstance.persistence.revisionMap[tweetId] = revHash;
                                classInstance.persistence.submissionMap[tweetId] = submissionIndex;
                                res({tx_id, submissionEvent, revHash, submissionIndex});  
                            }
                        })
                    }).catch(rej) 
                } else {
                    instance.getUserCurrentSubmissionIndex(account).then((index) => {
                        var nextSubIndex = index;
                        instance.submitSubmissionWithReferences.sendTransaction(revHash, [], [], [], {from : account, gas : maxGas, gasPrice : 1000000000}).then((tx_id) => {
                            var submissionEvent = instance.RevisionPosted({_authorg : account, _subIndex : nextSubIndex, _revHash : revHash});
                            submissionEvent.watch(function(error, result) {
                                if (!error && result.transactionHash == tx_id) {
                                    classInstance.persistence.revisionMap[tweetId] = revHash;
                                    classInstance.persistence.submissionMap[tweetId] = nextSubIndex;
                                    res({tx_id, submissionEvent, revHash, nextSubIndex});  
                                }
                            })
                        }).catch(rej) 
                    })

                }
        
               
            });
          });
        }); 
    }

    checkTweets() {     
        console.log("check tweets. tweetsIndex = " + this.tweetsIndex);
        if (this.tweetsIndex == -1) {  
            var options = { screen_name: this.twitterScreenName,
                            count: 200,
                            tweet_mode: "extended" };
            var instance = this;
            this.T.get('statuses/user_timeline', options , function(err, data) {
                instance.tweetData = data;
                instance.tweetsIndex = data.length - 1;
                instance.flushTweetData();
            })
        }
    }

    flushTweetData() {
        var instance = this;
        if (this.tweetsIndex > -1) {
            var tweet = instance.tweetData[this.tweetsIndex];

            if(!instance.persistence.seenTweets[tweet.id]) {
                if (tweet.in_reply_to_screen_name == instance.twitterScreenName) {
                    var parentId = instance.persistence.tweetMap[tweet.in_reply_to_status_id];
                    if (parentId) {
                        instance.persistence.tweetMap[tweet.id] = parentId;
                    } else { 
                        instance.persistence.tweetMap[tweet.id] = tweet.in_reply_to_status_id;
                        parentId = tweet.in_reply_to_status_id;
                    }

                    var parentRevisionHash = instance.persistence.revisionMap[tweet.in_reply_to_status_id];
                    var parentSubmissionIndex = instance.persistence.submissionMap[tweet.in_reply_to_status_id];
                    if (parentRevisionHash) {
                        const bzzAddress = parentRevisionHash.substring(2);
                        instance.web3.bzz.retrieve(bzzAddress, (error, revision) => {
                            const manifest = JSON.parse(revision);
                            instance.web3.bzz.retrieve(manifest.entries[0].hash, (error, rev) => {   
                                var revJson = JSON.parse(rev)
                                var state = revJson.text;
                                instance.finishPost(state, tweet, parentSubmissionIndex);
                            })
                        })
                    } else {
                        instance.saveAndFlush(tweet);
                    }
                } else if (!tweet.in_reply_to_screen_name && !tweet.retweeted_status) {
                    var state = {
                        "document":{
                            "data":{},
                            "kind":"document",
                            "nodes":[]
                        },
                        "kind":"value"
                    }
                    instance.finishPost(state, tweet);
                } else {
                    instance.saveAndFlush(tweet);
                }
            } else {
                instance.saveAndFlush(tweet);
            }
        } else {
           // this.tweetsIndex = -1;
        }
    }

    finishPost(state, tweet, submission = undefined) {

        var text = tweet.full_text;
        var textLeaves = text.split(' ');
        var nodes = [];
        textLeaves.forEach(function(leaf) {
            if (url(leaf)) {
                nodes.push({
                    "kind":"inline",
                    "type":"link",
                    "data":{"url" : leaf},
                    "nodes":[{
                        "kind":"text",
                        "leaves":[{
                            "kind":"leaf",
                            "marks":[],
                            "text": leaf
                        }]
                    }]
                })
                nodes.push({
                    "kind":"text",
                    "leaves":[{
                        "kind":"leaf",
                        "marks":[],
                        "text": " "
                    }]
                })
            } else {
                nodes.push({
                    "kind":"text",
                    "leaves":[{
                        "kind":"leaf",
                        "marks":[],
                        "text": leaf + " "
                    }]
                })
            }
        })

        state.document.nodes.push({
            "data":{},
            "kind":"block",
            "isVoid":false,
            "type":"paragraph",
            "nodes":nodes
        })


        var instance = this;
        var postJson = {"authorg" : instance.ethAccount, "text" : state}
        instance.post(JSON.stringify(postJson), instance.ethAccount, instance.web3, tweet.id, submission).then((result) => {
            console.log("posted.")
            instance.saveAndFlush(tweet);
        }).catch((reason) => {
            console.warn("rejected for reason: " + reason);
            instance.saveAndFlush(tweet);
        })
    }

    saveAndFlush(tweet) {
        var instance = this;
        instance.persistence.seenTweets[tweet.id] = true;
        fs.writeFile(__dirname + "/botsPersistence/" + instance.twitterScreenName + ".txt", JSON.stringify(instance.persistence), (err) => {
            if (err) throw err;
            instance.tweetsIndex = this.tweetsIndex - 1;
            instance.flushTweetData();
        });
    }
}

module.exports = RepostBot