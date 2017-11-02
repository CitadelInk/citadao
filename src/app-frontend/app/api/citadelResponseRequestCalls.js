import appContracts from 'app-contracts';

export const requestResponse = (account, recipientUser, postUser, postSubmission, postRevision, bounty) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.submitResponseRequest.sendTransaction(recipientUser, postUser, postSubmission, postRevision, {from : account, value : bounty, gas : 1000000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestCreated({_offererUser : account, _recipientUser : recipientUser});
        var t1 = performance.now();
        console.debug("requestResponse took " + (t1 - t0) + " milliseconds.")
        res({tx_id, event})    
      });
    });
  });
} 

export const collectBounty = (account, offererUser, postUser, postSubmission, postRevision) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.collectResponseRequestBounty.sendTransaction(offererUser, postUser, postSubmission, postRevision, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestBountyCollected({_offererUser : offererUser, _recipientUser : account});
        var t1 = performance.now();
        console.debug("collectBounty took " + (t1 - t0) + " milliseconds.")
        res({tx_id, event})    
      });
    });
  });
} 

export const withdrawBounty = (account, recipientUser, postUser, postSubmission, postRevision) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.refundResponseRequestBounty.sendTransaction(recipientUser, postUser, postSubmission, postRevision, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestBountyRefunded({_offererUser : account, _recipientUser : recipientUser});
        
        var t1 = performance.now();
        console.debug("withdrawBounty took " + (t1 - t0) + " milliseconds.")
        res({tx_id, event})    
      });
    });
  });
} 

export const checkCitadelUserReferenceAgainstPost = (recipientUser, postUser, postSubmission, postRevision) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.doesUserReferencePost(recipientUser, postUser, postSubmission, postRevision).then((result) => {
        var t1 = performance.now();
        console.debug("checkCitadelUserReferenceAgainstPost took " + (t1 - t0) + " milliseconds.")
        res(result);
      })
    })
  })
}

export const checkUserReferenceAgainstPost = (recipientUser, postUser, postSubmission, postRevision) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.doesPostReferencePost(recipientUser, postUser, postSubmission, postRevision).then((result) => {
        var t1 = performance.now();
        console.debug("checkUserReferenceAgainstPost took " + (t1 - t0) + " milliseconds.")
        res(result);
      })
    })
  })
}

export const getCitadelResponseRequestInkAddress = () => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getInkAddress().then((result) => {
        var t1 = performance.now();
        console.debug("getCitadelResponseRequestInkAddress took " + (t1 - t0) + " milliseconds.")
        res(result);
      })
    })
  })
}

export const getPostResponseRequestOfferers = (postUser, postSubmission, postRevision) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getOffererRecipientKeysForPost(postUser, postSubmission, postRevision).then((result) => {
        var t1 = performance.now();
        console.debug("getPostResponseRequestOfferers took " + (t1 - t0) + " milliseconds.")
        res({offerers : result[0], recipients : result[1]});
      })
    })
  })
}

export const getResponseRequestReceipt = (postUser, postSubmission, postRevision, offererUser, recipientUser) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getReceipt(postUser, postSubmission, postRevision, offererUser, recipientUser).then((result) => {
        var t1 = performance.now();
        console.debug("getResponseRequestReceipt took " + (t1 - t0) + " milliseconds.")
        res({exists : result[0], timestamp : result[1], bounty : result[2], collected : result[3], completed : result[4], withdrawn : result[5]});
      })
    })
  })
}

export const getUserResponseRequestOffersReceived = (user) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getUserBountiesReceived(user).then((result) => {
        var t1 = performance.now();
        console.debug("getUserResponseRequestOffersReceived took " + (t1 - t0) + " milliseconds.")
        res({offerers : result[0], postUsers : result[1], postSubmissions : result[2], postRevisions : result[3]});
      })
    })
  })
}

export const getUserResponseRequestOffersCreated = (user) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getUserBountiesCreated(user).then((result) => {
        var t1 = performance.now();
        console.debug("getUserResponseRequestOffersCreated took " + (t1 - t0) + " milliseconds.")
        res({recipients : result[0], postUsers : result[1], postSubmissions : result[2], postRevisions : result[3]});
      })
    })
  })
}