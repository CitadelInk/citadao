import appContracts from 'app-contracts';

export const updateBuyPrice = (newBuyPrice, account, web3) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance.setPrices.sendTransaction(web3.toBigNumber('0'), newBuyPrice, {from : account, gasPrice : 1000000000})).then(function(tx_id) {
      return appContracts.MyAdvancedToken.deployed()
        .then((data) => data.buyPrice())
        .then((p) => parseFloat(p.toString()))
        .then((p) => {return {citaBuyPrice : p}});  
    }).catch(function(e) {
      alert("error - " + e);
    })
};

export const addApprovedReaction = (reaction, account, web3) => {
  return new Promise((res, rej) => {
    web3.bzz.put(reaction, (error, hash) => {
      appContracts.Citadel.deployed()
      .then((instance) => {
        instance.addApprovedReaction.sendTransaction('0x' + hash, {from : account, gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
          res(tx_id);
        }).catch(rej);
      });
    });
  });
}

export const updateBio = (bioInput, account, web3) => {
  return new Promise((res, rej) => {
    web3.bzz.put(bioInput, (error, hash) => {
      appContracts.Ink.deployed()
      .then((instance) => {
        var subHash = '0x' + hash;
        instance.submitBioRevision.sendTransaction('0x' + hash, {from : account, gas : 200000, gasPrice : 1000000000}).then((tx_id) => {
          var bioSubmissionEvent = instance.BioUpdated({_authorg : account, _subHash : subHash})
          res({tx_id, bioSubmissionEvent})
        }).catch(rej);
      });
    });
  }); 
};

export const post = (postInput, refKeyAuths, refKeySubs, refKeyRevs, account, web3, revisesubmissionIndex) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    web3.bzz.put(postInput, (error, hash) => {
      appContracts.Ink.deployed()
      .then((instance) => {
        var maxGas = 400000 + refKeyAuths.length * 200000;
        var revHash = '0x' + hash;

        if (revisesubmissionIndex) {
          var subHash = revisesubmissionIndex;
          instance.submitRevisionWithReferences.sendTransaction(subHash, revHash, refKeyAuths, refKeySubs, refKeyRevs, {from : account, gas : maxGas, gasPrice : 1000000000}).then((tx_id) => {
            var submissionEvent = instance.RevisionPosted({_authorg : account});
            var t1 = performance.now();
            console.debug("post took " + (t1 - t0) + " milliseconds.")
            res({tx_id, submissionEvent, revHash, subHash});  
          }).catch(rej);
        } else {
          instance.submitSubmissionWithReferences.sendTransaction(revHash, refKeyAuths, refKeySubs, refKeyRevs, {from : account, gas : maxGas, gasPrice : 1000000000}).then((tx_id) => {
            var submissionEvent = instance.RevisionPosted({_authorg : account});
            var t1 = performance.now();
            console.debug("post took " + (t1 - t0) + " milliseconds.")
            res({tx_id, submissionEvent, revHash, subHash});  
          }).catch(rej);
        }        
      });
    });
  }); 
}

export const submitBuy = (eth, account, tokenOwnerAccount) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => {
      return instance.buy.sendTransaction({
        from : account,
        to : tokenOwnerAccount, 
        value : eth,
        gasPrice : 1000000000
      });
    });
};

export const addReaction = (account, authorg, submissionIndex, revisionHash, reaction) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      instance.submitReaction.sendTransaction(authorg, submissionIndex, revisionHash, reaction, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var reactionEvent = instance.ReactionRecorded({_postAuthorg : authorg, _postSubmission : submissionIndex, _postRevision : revisionHash});
        res({tx_id, reactionEvent})    
      });      
    });
  });
}

export const addBioReaction = (account, authorg, revisionHash, reaction) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      instance.submitAuthorgReaction.sendTransaction(authorg, revisionHash, reaction, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var bioReactionEvent = instance.AuthorgReactionRecorded({_postAuthorg : authorg});
        res({tx_id, bioReactionEvent})    
      });      
    });
  });
}

export const followAuthorg = (account, authorg) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      instance.follow.sendTransaction(authorg, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var followEvent = instance.AuthorgFollowed({_authorgFollowed : authorg, _follower : account});
        res({tx_id, followEvent})    
      });
    });
  });
} 