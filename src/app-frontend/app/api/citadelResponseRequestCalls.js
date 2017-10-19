import appContracts from 'app-contracts';

export const requestResponse = (account, recipientUser, postUser, postSubmission, postRevision, bounty) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.submitResponseRequest.sendTransaction(recipientUser, postUser, postSubmission, postRevision, {from : account, value : bounty, gas : 1000000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestCreated({_offererUser : account, _recipientUser : recipientUser});
        res({tx_id, event})    
      });
    });
  });
} 

export const collectBounty = (account, offererUser, postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.collectResponseRequestBounty.sendTransaction(offererUser, postUser, postSubmission, postRevision, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestBountyCollected({_offererUser : offererUser, _recipientUser : account});
        res({tx_id, event})    
      });
    });
  });
} 

export const withdrawBounty = (account, recipientUser, postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.refundResponseRequestBounty.sendTransaction(recipientUser, postUser, postSubmission, postRevision, {from : account, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        var event = instance.ResponseRequestBountyRefunded({_offererUser : account, _recipientUser : recipientUser});
        res({tx_id, event})    
      });
    });
  });
} 

export const checkCitadelUserReferenceAgainstPost = (recipientUser, postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.doesUserReferencePost(recipientUser, postUser, postSubmission, postRevision).then((result) => {
        res(result);
      })
    })
  })
}

export const checkUserReferenceAgainstPost = (recipientUser, postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.doesPostReferencePost(recipientUser, postUser, postSubmission, postRevision).then((result) => {
        res(result);
      })
    })
  })
}

export const getCitadelResponseRequestInkAddress = () => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getInkAddress().then((result) => {
        res(result);
      })
    })
  })
}

export const getPostResponseRequestOfferers = (postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getOffererRecipientKeysForPost(postUser, postSubmission, postRevision).then((result) => {
        res({offerers : result[0], recipients : result[1]});
      })
    })
  })
}

export const getResponseRequestReceipt = (postUser, postSubmission, postRevision, offererUser, recipientUser) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getReceipt(postUser, postSubmission, postRevision, offererUser, recipientUser).then((result) => {
        res({exists : result[0], timestamp : result[1], bounty : result[2], collected : result[3], completed : result[4], withdrawn : result[5]});
      })
    })
  })
}

export const getUserResponseRequestOffersReceived = (user) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getUserBountiesReceived(user).then((result) => {
        res({offerers : result[0], postUsers : result[1], postSubmissions : result[2], postRevisions : result[3]});
      })
    })
  })
}

export const getUserResponseRequestOffersCreated = (user) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.getUserBountiesCreated(user).then((result) => {
        res({recipients : result[0], postUsers : result[1], postSubmissions : result[2], postRevisions : result[3]});
      })
    })
  })
}