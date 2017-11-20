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
  loadUserData,
  doFocusedLoad
} from './getPostData'


export const SET_AUTHORG_FOLLOWS_AUTHORG = "SET_AUTHORG_FOLLOWS_AUTHORG";
export const setAuthorgFollowsAuthorg = (followingAuthorg, followedAuthorg) => {
  return {
    type: SET_AUTHORG_FOLLOWS_AUTHORG,
    data: {authAdd : followingAuthorg, followedAuthorg}
  }
}



export const submitRevision = (input, revisionHash, onComplete, onFailure) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
    onFailure();
  } else {
    dispatch(submitNewRevision(input, onComplete, onFailure, revisionHash))
  }
}

export const submitPost = (input, onComplete, onFailure) => (dispatch, getState) => {
  const {wallet, auths} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
    onFailure();
  } else {

    var auth = auths[account];
    if (auth) {
      if (auth.bioSubmission) {
        dispatch(submitNewRevision(input, onComplete, onFailure));
      } else {
        alert("Please submit a bio before you post.")
        onFailure();
      }
    } else {
      alert("Auth not found.")
      onFailure();
    }
  }
}

export const submitBio = (bioTextInput, onComplete, onFailure) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
    onFailure();
  } else {
    const ethBalance = wallet.get('ethBalance');
  
    // hack. need to check cost correctly.
    if (!ethBalance > 0) {
      alert("Please buy ETH using the button in the top right corner of your screen. ETH is required to post.");
      onFailure();
    } else {
      const bioNameInput = wallet.get('bioNameInput');
      const bioAvatarImage = wallet.get('bioAvatarImage');
      var bioJson = {"name" : bioNameInput, "text" : bioTextInput, "image" : bioAvatarImage}
      return updateBio(JSON.stringify(bioJson), account, network.web3).then(function(tx_result) {
        var hasReloaded = false;
        tx_result.bioSubmissionEvent.watch(function(error,result){
          if (!error && result.transactionHash === tx_result.tx_id) {
            dispatch(loadUserData(account, true, true));
            onComplete();
            hasReloaded = true;
          }
        });
        setTimeout(function () {      
          if (!hasReloaded) {
            dispatch(loadUserData(account, true, true));
          }
        }, 3000); 
      }).catch(function(e) {
        console.error("error - " + e);
        onFailure();
      });
    }
  }
 
};

export const submitNewRevision = (postTextInput, onComplete, onFailure, revisionsubmissionIndex = undefined) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');

  const ethBalance = wallet.get('ethBalance');

  // hack. need to check cost correctly.
  if (!ethBalance > 0) {
    alert("Please buy ETH using the button in the top right corner of your screen. ETH is required to post.")
    onFailure();
  } else {
    var referenceKeyAuthorgs = [];
    var referenceKeySubmissions = [];
    var referenceKeyRevisions = [];

    var referenceKeyMapSet = new Map(); //using map as a set cause sets are weird or something...

    postTextInput.document.nodes.map((section) => {
      try {
        if(section.data.get('authorg') 
          && section.data.get('submission')
          && section.data.get('revision')) {
          var authorg = section.data.get('authorg');
          var submissionIndex = section.data.get('submission');
          var revisionHash = section.data.get('revision');
          var index = section.data.get('index');
        
          var refKey = {authorg:authorg, subHash:submissionIndex, revHash:revisionHash}
          var refMapSetKey = authorg + "-" + submissionIndex + "-" + revisionHash;
          if (!referenceKeyMapSet.get(refMapSetKey)) {
            referenceKeyMapSet.set(refMapSetKey, true);
            referenceKeyAuthorgs.push(authorg);
            referenceKeySubmissions.push(submissionIndex);
            referenceKeyRevisions.push(revisionHash);
          }      
        }
      } catch (e) {
        console.error("error when posting: " + e);
        onFailure();
      }
    })

    
    var postJson = {"authorg" : account, "text" : postTextInput}
    return post(JSON.stringify(postJson), referenceKeyAuthorgs, referenceKeySubmissions, referenceKeyRevisions, account, network.web3, revisionsubmissionIndex).then(function(resulty) {
      var hasReloaded = false;
      var update = function(revisionsubmissionIndex = undefined) {
        if (revisionsubmissionIndex) {
          console.log("load revised post.")
          dispatch(doFocusedLoad(account, revisionsubmissionIndex, resulty.revHash, undefined, true, true))
        } else {
          console.log("initialize needed posts")
          dispatch(doFocusedLoad(account, resulty.subHash, resulty.revHash, undefined, true, true))
        }
        hasReloaded = true;
        onComplete();
      };
      resulty.submissionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          update();
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          update();
        }
      }, 3000)
    }).catch(function(e) {
      console.error("error - " + e);
      onFailure();
    });
  }
};

export const submitReaction = (authorg, submissionIndex, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet, approvedReactions} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    return addReaction(account, authorg, submissionIndex, revisionHash, reaction).then(function(resulty) {
      var hasReloaded = false;
      resulty.reactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(getReactions(authorg, submissionIndex, revisionHash, approvedReactions));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(getReactions(authorg, submissionIndex, revisionHash, approvedReactions));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
}

export const submitBioReaction = (authorg, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet, approvedAuthorgReactions} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    return addBioReaction(account, authorg, revisionHash, reaction).then(function(resulty) {
      var hasReloaded = false;      
      resulty.bioReactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(loadAuthorgBioReactions(authorg, revisionHash, approvedAuthorgReactions));
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(loadAuthorgBioReactions(authorg, revisionHash, approvedAuthorgReactions));
        }
      }, 3000);
      
    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
}

export const follow = (authorg) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  return followAuthorg(account, authorg).then(function(tx_result) {
    var hasReloaded = false;      
    tx_result.followEvent.watch(function(error,result){
      if (!error && result.transactionHash === tx_result.tx_id) {
        dispatch(setAuthorgFollowsAuthorg(account, authorg));
      }
    });
    setTimeout(function() {
      if (!hasReloaded) {
        dispatch(setAuthorgFollowsAuthorg(account, authorg));
      }
    }, 3000);
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
