import appContracts from 'app-contracts'

export const getEthBalance = (account, web3) => {
  return new Promise((res, rej) => {
    web3.eth.getBalance(account, web3.eth.defaultBlock, (error, balance) => {
      if (error) {
        rej(error);
      } else if (balance) {
        var b = web3.fromWei(balance, 'ether').toString();
        res({b})
      }
    });
  });
}

// could be cleaned

export const getAccounts = (web3) => {
  return new Promise((res, rej) => {
    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        rej(error);
      } else if (accounts) {
        res({accounts})
      }
    });
  });
}

export const getApprovedReactions = () => {
  return new Promise((res, rej) =>{
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getApprovedReactions()
      ])
      .then(([approvedReactionHashes]) => {
        getReactionValues(approvedReactionHashes).then((approvedReactions) => {
          console.log("approvedReactions: " + approvedReactions);
          console.log("approvedReactions.reactions: " + (approvedReactions.reactions));
          res({approvedReactions : approvedReactions.reactions});
        })
      })
    });
  });
}

export const getReactionValues = (approvedReactionHashes) => {
  return new Promise((res, rej) => {
    var promises = approvedReactionHashes.map(hash => {
      return getReactionValue(hash)
    })
    Promise.all(promises).then(values => {
      console.log("promises values: " + values)
      var reactions = values.map(result => {
        return {reactionHash : result.reactionHash, reactionValue : result.reactionValue};
      })
      console.log("reactions: " + reactions)
      res({reactions : reactions});
    })
  })  
}

// do this differently once we have submission cache/infinite scrolling
export const getSubmissions = () => {
  return new Promise((res, rej) =>{
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getAllSubmissions()
      ])
      .then(([allSubmissionsTest]) => {
        console.log("allSubmissionsTest: " + allSubmissionsTest);
        res({allSubmissionsTest : allSubmissionsTest})
      })
    });
  });
}

export const getAccountBioRevisions = (account) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)
      ])
      .then(([bioRevisions]) => {
        res({bioRevisions: bioRevisions})
      })
    });
  });
}

export const getAccountName = (account) => {
   return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)]
      )      
      .then(([bioRevisions]) => {
        if(bioRevisions !== null) {
          if (bioRevisions.length > 0) {
            const mostRecentBio = bioRevisions[bioRevisions.length - 1];
            getAccountBioRevision(mostRecentBio)
            .then((data) => {
              res({
                accountName : JSON.parse(data.selectedBioRevision.toString()).name
              })
            })
          } else {
            res({accountName : "none"})
          }
        } else {
          res({accountName : "none"})
        }
      })
    })
  });
}

export const getReactionValue = (reactionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = reactionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, reactionManifest) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(reactionManifest)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, reaction) => {
        res({
          reactionHash: reactionHash, reactionValue: reaction
        });
      });
    });
  });
}

export const getAccountBioRevision = (revisionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, bio) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(bio)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
        res({
          selectedBioRevision: bioText
        });
      });
    });
  });
}

// once we add revisioning, will need to get specific revision (default likely most recent?)
export const getSubmission = (submissionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = submissionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, submission) => {
      console.log("retrieved! submission = " + submission);
      const jsonSubmission = JSON.parse(submission)
      web3.bzz.retrieve(jsonSubmission.entries[0].hash, (error, entry) => {     
        console.log("retrieved! entry = " + entry);
        var subJson = JSON.parse(entry)
        res ({
          submissionAuthorg: subJson.authorg, 
          submissionHash: submissionHash, 
          revisionHash: submissionHash, 
          submissionTitle: subJson.title, 
          submissionText: subJson.text
        }) 
      })
    })
  })
}

export const getSubmissionReactions = (submissionHash, authorgHash, reactions) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = reactions.map(reaction => {
        return instance.getReactorsForAuthorgSubmissionRevisionReaction(authorgHash, submissionHash, submissionHash, reaction.reactionHash).then((reactors) => {
          return {reactionHash : reaction.reactionHash, reactionValue : reaction.reactionValue, reactionReactors : reactors};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        console.log("revisionReactionReactors: " + revisionReactionReactors)
        res ({
          revisionReactionReactors: revisionReactionReactors
        })
      })
    })
  });
}
