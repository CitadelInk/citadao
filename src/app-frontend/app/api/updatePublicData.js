import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const updateBuyPrice = (newBuyPrice, account) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance.setPrices.sendTransaction(localWeb3.toBigNumber('0'), newBuyPrice, {from : account})).then(function(tx_id) {
      return appContracts.MyAdvancedToken.deployed()
        .then((data) => data.buyPrice())
        .then((p) => parseFloat(p.toString()))
        .then((p) => {return {citaBuyPrice : p}});  
    }).catch(function(e) {
      alert("error - " + e);
    })
};

export const addApprovedReaction = (reaction, account) => {
  return new Promise((res, rej) => {
    localWeb3.bzz.put(reaction, (error, hash) => {
      appContracts.Citadel.deployed()
      .then((instance) => {
        instance.addApprovedReaction.sendTransaction('0x' + hash, {from : account, gas : 200000}).then((tx_id) => {
          res(tx_id);
        }).catch(rej);
      });
    });
  });
}

export const updateBio = (bioInput, account) => {
  return new Promise((res, rej) => {
    localWeb3.bzz.put(bioInput, (error, hash) => {
      appContracts.Ink.deployed()
      .then((instance) => {
        instance.submitBioRevision.sendTransaction('0x' + hash, {from : account, gas : 200000}).then((tx_id) => {
          res(tx_id)
        }).catch(rej);
      });
    });
  }); 
};

export const post = (postInput, references, account) => {
  return new Promise((res, rej) => {
    localWeb3.bzz.put(postInput, (error, hash) => {
      appContracts.Ink.deployed()
      .then((instance) => {
        //for now, submission and revision same thing
        instance.submitRevision.sendTransaction('0x' + hash, '0x' + hash, {from : account, gas : 400000}).then((tx_id) => {
          var linkReferences = references.map((reference) => {
            return instance.respondToAuthorgSubmissionRevision.sendTransaction(reference.authorg, reference.submissionHash, reference.revisionHash, '0x' + hash, '0x' + hash, {from : account, gas : 400000});
          })
          return Promise.all(linkReferences).then((values) => {
            res(tx_id)
          })
        }).catch(rej);
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
        value : eth
      });
    });
};

export const addReaction = (account, authorg, submissionHash, revisionHash, reaction) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      instance.submitReaction.sendTransaction(authorg, submissionHash, revisionHash, reaction, {from : account, gas : 300000}).then((tx_id) => {
        res(tx_id)
      }).catch(rej);
    });
  });
}