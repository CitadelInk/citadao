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

export const submitBio = () => (dispatch, getState) => {
  const {wallet} = getState();
  const account = wallet.get('account');
  const bioNameInput = wallet.get('bioNameInput');
  const bioTextInput = wallet.get('bioTextInput')
  var bioJson = {"name" : bioNameInput, "text" : bioTextInput}
  return updateBio(JSON.stringify(bioJson), account).then(function(tx_id) {
      alert("bio added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
};


export const submitPost = () => (dispatch, getState) => {
  const {wallet} = getState();
  const account = wallet.get('account');
  const postTitleInput = wallet.get('postTitleInput');
  const postTextInput = wallet.get('postTextInput');


  var textInputSplit = postTextInput.split('\n');
  var trimmedTextInput = [];
  textInputSplit.map(input => {
    if(input.trim() != "") {
      trimmedTextInput.push(input)
    }
  });

  var references = [];
  trimmedTextInput.map((section) => {
    try {
      var json = JSON.parse(section);
      if (json) {
        var reference = json.reference;
        if (reference) {
          references.push(reference)
        }
      }
    } catch (e) {

    }
  })

  var postJson = {"authorg" : account, "title" : postTitleInput, "text" : trimmedTextInput}
  return post(JSON.stringify(postJson), references, account).then(function(tx_id) {
      alert("post added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
};

export const submitReaction = (authorg, submissionHash, revisionHash, reaction) => (dispatch, getState) => {
  const {wallet} = getState();
  const account = wallet.get('account');
  return addReaction(account, authorg, submissionHash, revisionHash, reaction).then(function(tx_id) {
      alert("post added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
}

export default {
  submitBio,
  submitPost,
  submitReaction
};
