import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

import {
  addReaction,
  updateBuyPrice,
  addApprovedReaction,
  updateBio,
  updateName,
  submitNameChange,
  submitBuy,
  post,
  followAuthorg,
  addBioReaction
} from '../api/updatePublicData';

import {
  getReactions,
  initializeNeededPosts,
  loadAuthorgBioReactions,
  loadUserData
} from './getPostData'


export const SET_AUTHORG_FOLLOWS_AUTHORG = "SET_AUTHORG_FOLLOWS_AUTHORG";
export const setAuthorgFollowsAuthorg = (followingAuthorg, followedAuthorg) => {
  return {
    type: SET_AUTHORG_FOLLOWS_AUTHORG,
    data: {authAdd : followingAuthorg, followedAuthorg}
  }
}


export const submitBio = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://104.236.160.22:8545/")
  } else {
    const inkBalance = wallet.get('inkBalance');
  
    // hack. need to check cost correctly.
    if (inkBalance < 10) {
      alert("Please buy INK using the button in the top right corner of your screen. INK is required to post.")
    } else {
      const bioNameInput = wallet.get('bioNameInput');
      const bioTextInput = wallet.get('bioTextInput');
      const bioAvatarImage = wallet.get('bioAvatarImage');
      var bioJson = {"name" : bioNameInput, "text" : bioTextInput, "image" : bioAvatarImage}
      return updateBio(JSON.stringify(bioJson), account, network.web3).then(function(tx_id) {
        setTimeout(function () {      
          dispatch(loadUserData(account, true, true))
        }, 3000); 
      }).catch(function(e) {
        console.error("error - " + e);
      });
    }
  }
 
};

export const submitRevision = (revisionHash) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://104.236.160.22:8545/")
  } else {
    var input = wallet.get('reviseSubmissionInput');
    dispatch(submitNewRevision(input, revisionHash))
  }
}

export const submitPost = () => (dispatch, getState) => {  
  const {wallet, auths} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://104.236.160.22:8545/")
  } else {
    var input = wallet.get('postTextInput');

    var auth = auths[account];
    if (auth) {
      if (auth.bioSubmission) {
        dispatch(submitNewRevision(input));
      } else {
        alert("Please submit a bio before you post.")
      }
    } else {
      alert("Auth not found.")
    }
  }
}

export const submitNewRevision = (postTextInput, revisionSubmissionHash = undefined) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');

  const inkBalance = wallet.get('inkBalance');

  // hack. need to check cost correctly.
  if (inkBalance < 10) {
    alert("Please buy INK using the button in the top right corner of your screen. INK is required to post.")
  } else {
    var referenceKeyAuthorgs = [];
    var referenceKeySubmissions = [];
    var referenceKeyRevisions = [];
    postTextInput.document.nodes.map((section) => {
      try {
        var json = JSON.parse(section.text);
        if (json) {
          var reference = json.reference;
          if (reference) {

            var refKey = {authorg:reference.authorg, subHash:reference.submissionHash, revHash:reference.revisionHash}
            if(referenceKeyAuthorgs.indexOf(reference.authorg) < 0 ) {
              if(referenceKeySubmissions.indexOf(reference.submissionHash) < 0 ) {
                if(referenceKeyRevisions.indexOf(reference.revisionHash) < 0 ) {
                  referenceKeyAuthorgs.push(reference.authorg);
                  referenceKeySubmissions.push(reference.submissionHash);
                  referenceKeyRevisions.push(reference.revisionHash);
                }
              }
            }
          }
        }
      } catch (e) {
        console.error("error when posting: " + e);
      }
    })

    var postJson = {"authorg" : account, "text" : postTextInput}
    return post(JSON.stringify(postJson), referenceKeyAuthorgs, referenceKeySubmissions, referenceKeyRevisions, account, network.web3, revisionSubmissionHash).then(function(tx_id) {
      
      // hack as fuck, need to listen to event or similar since this function returns before chain is updated apparently
      setTimeout(function () {      
        dispatch(initializeNeededPosts())
      }, 3000); 

    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
};

export const submitReaction = (authorg, submissionHash, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet, approvedReactions} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://104.236.160.22:8545/")
  } else {
    return addReaction(account, authorg, submissionHash, revisionHash, reaction).then(function(resulty) {
      resulty.reactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions))
        }
      });
    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
}

export const submitBioReaction = (authorg, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet, approvedAuthorgReactions} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://104.236.160.22:8545/")
  } else {
    return addBioReaction(account, authorg, revisionHash, reaction).then(function(resulty) {
      
      resulty.bioReactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(loadAuthorgBioReactions(authorg, revisionHash, approvedAuthorgReactions))
        }
      });
    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
}

export const follow = (authorg) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  return followAuthorg(account, authorg).then(function(tx_result) {
    tx_result.followEvent.watch(function(error,result){
      if (!error && result.transactionHash === tx_result.tx_id) {
        dispatch(setAuthorgFollowsAuthorg(account, authorg));
      }
    })
  })
}

export default {
  submitBio,
  submitPost,
  submitRevision,
  submitReaction,
  submitBioReaction,
  follow,
  SET_AUTHORG_FOLLOWS_AUTHORG
};
