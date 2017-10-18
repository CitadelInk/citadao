import appContracts from 'app-contracts';

export const requestResponse = (account, recipientUser, postUser, postSubmission, postRevision, bounty) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.submitResponseRequest.sendTransaction(recipientUser, postUser, postSubmission, postRevision, {from : account, value : bounty, gas : 300000, gasPrice : 1000000000}).then((tx_id) => {
        //var followEvent = instance.AuthorgFollowed({_authorgFollowed : authorg, _follower : account});
        res({tx_id/*, followEvent*/})    
      });
    });
  });
} 

export const collectBounty = (account, offererUser, postUser, postSubmission, postRevision) => {
  return new Promise((res, rej) => {
    appContracts.CitadelResponseRequest.deployed()
    .then((instance) => {
      instance.collectResponseRequestBounty.sendTransaction(offererUser, postUser, postSubmission, postRevision, {from : account, gas : 3000000, gasPrice : 1000000000}).then((tx_id) => {
        //var followEvent = instance.AuthorgFollowed({_authorgFollowed : authorg, _follower : account});
        res({tx_id/*, followEvent*/})    
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
        res({exists : result[0], timestamp : result[1], bounty : result[2], collected : result[3]});
      })
    })
  })
}