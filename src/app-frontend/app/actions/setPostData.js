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
  post
} from '../api/updatePublicData';

import {
  getReactions,
  initializeNeededPosts
} from './getPostData'

export const submitBio = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  const bioNameInput = wallet.get('bioNameInput');
  const bioTextInput = wallet.get('bioTextInput')
  var bioJson = {"name" : bioNameInput, "text" : bioTextInput}
  return updateBio(JSON.stringify(bioJson), account, network.web3).then(function(tx_id) {
      alert("bio added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
};


export const submitPost = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  const postTitleInput = wallet.get('postTitleInput');
  const postTextInput = wallet.get('postTextInput');


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

  var postJson = {"authorg" : account, "title" : postTitleInput, "text" : postTextInput}
  return post(JSON.stringify(postJson), referenceKeyAuthorgs, referenceKeySubmissions, referenceKeyRevisions, account, network.web3).then(function(tx_id) {
    
    // hack as fuck, need to listen to event or similar since this function returns before chain is updated apparently
    setTimeout(function () {      
      dispatch(initializeNeededPosts())
    }, 3000); 

  }).catch(function(e) {
    alert("error - " + e);
  });
};

export const submitReaction = (authorg, submissionHash, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet, approvedReactions} = getState().core;
  const account = wallet.get('account');
  return addReaction(account, authorg, submissionHash, revisionHash, reaction).then(function(resulty) {
    resulty.reactionEvent.watch(function(error,result){
      if (!error && result.transactionHash == resulty.tx_id) {
        dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions))
      }
    });
  }).catch(function(e) {
    alert("error - " + e);
  });
}

export default {
  submitBio,
  submitPost,
  submitReaction
};
