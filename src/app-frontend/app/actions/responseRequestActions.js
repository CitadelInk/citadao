import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

import {
  requestResponse,
  getPostResponseRequestOfferers,
  getResponseRequestReceipt,
  collectBounty,
  checkUserReferenceAgainstPost,
  checkCitadelUserReferenceAgainstPost,
  getCitadelResponseRequestInkAddress
} from '../api/citadelResponseRequestCalls'


export const SET_REVISION_REQUEST_RESPONSE_KEYS = "SET_REVISION_REQUEST_RESPONSE_KEYS";
export const setRevisionRequestResponseKeys = (authAdd, subHash, revHash, requestResponseOfferers, requestResponseRecipients) => {
  return {
    type: SET_REVISION_REQUEST_RESPONSE_KEYS,
    data: {authAdd, subHash, revHash, requestResponseOfferers, requestResponseRecipients}
  }
}

export const SET_REVISION_REQUEST_RESPONSE_RECEIPT = "SET_REVISION_REQUEST_RESPONSE_RECEIPT";
export const setRevisionResponseRequestReceipt = (authAdd, subHash, revHash, offerer, recipient, exists, timestamp, bounty, collected) => {
  console.log("1 set revision resonse request receipt")
  return {
    type: SET_REVISION_REQUEST_RESPONSE_RECEIPT,
    data: {authAdd, subHash, revHash, offerer, recipient, receipt: {exists, timestamp, bounty, collected}}
  }
}

export const submitResponseRequest = (recipientUser, postUser, postSubmission, postRevision, bountyValue) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    console.log("lets send this shit. recipientUser: " + recipientUser);
    console.log("lets send this shit. postUser: " + postUser);
    console.log("lets send this shit. postSubmission: " + postSubmission);
    console.log("lets send this shit. postRevision: " + postRevision);
    console.log("lets send this shit. bountyValue: " + bountyValue);


    var convertedBounty = web3.toWei(bountyValue, "ether");

    return requestResponse(account, recipientUser, postUser, postSubmission, postRevision, convertedBounty).then(function(resulty) {
      /*var hasReloaded = false;
      resulty.reactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
    });*/
    console.log("request response resulty: " + resulty);
    });
  }
}

export const collectResponseRequestBounty = (offererUser, postUser, postSubmission, postRevision) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    return collectBounty(account, offererUser, postUser, postSubmission, postRevision).then(function(resulty) {
      /*var hasReloaded = false;
      resulty.reactionEvent.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(getReactions(authorg, submissionHash, revisionHash, approvedReactions));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
    });*/
    console.log("request response resulty: " + resulty);
    });
  }
}

export const checkCitadelIfUserReferencesPost = (recipientUser, originalPostUser, originalPostSubmission, originalPostRevision) => (dispatch, getState) => {
  console.log("check citadel 1");

    return checkCitadelUserReferenceAgainstPost(recipientUser, originalPostUser, originalPostSubmission, originalPostRevision).then(function(resulty) {
      console.log("checkCitadelUserReferenceAgainstPost result - " + resulty);
    })
  
}

export const checkIfUserReferencesPost = (recipientUser, originalPostUser, originalPostSubmission, originalPostRevision) => (dispatch) => {
  return checkUserReferenceAgainstPost(recipientUser, originalPostUser, originalPostSubmission, originalPostRevision).then(function(resulty) {
    console.log("checkUserReferenceAgainstPost result - " + resulty);
  })
}

export const checkCitadelResponseRequestInkAddress = () => (dispatch) => {
  return getCitadelResponseRequestInkAddress().then(function(resulty) {
    console.log("getCitadelResponseRequestInkAddress result - " + resulty);
  })
}

export const loadPostResponseRequests = (postUser, postSubmission, postRevision) => (dispatch) => {
  getPostResponseRequestOfferers(postUser, postSubmission, postRevision).then((result) => {
    if (result.offerers && result.recipients && result.offerers.length === result.recipients.length) {
      dispatch(setRevisionRequestResponseKeys(postUser, postSubmission, postRevision, result.offerers, result.recipients));
      for(var i = 0; i < result.offerers.length; i++) {
        dispatch(loadRequestResponse(postUser, postSubmission, postRevision, result.offerers[i], result.recipients[i]));
      }
    }
  })
}

export const loadRequestResponse = (postUser, postSubmission, postRevision, offerer, recipient) => (dispatch) => {
  getResponseRequestReceipt(postUser, postSubmission, postRevision, offerer, recipient).then((result) => {
    dispatch(setRevisionResponseRequestReceipt(postUser, postSubmission, postRevision, offerer, recipient, result.exists, result.timestamp, result.bounty, result.collected))
  })
}


export default {
  submitResponseRequest,
  loadPostResponseRequests,
  collectResponseRequestBounty,
  checkIfUserReferencesPost,
  checkCitadelIfUserReferencesPost,
  checkCitadelResponseRequestInkAddress,
  SET_REVISION_REQUEST_RESPONSE_KEYS,
  SET_REVISION_REQUEST_RESPONSE_RECEIPT
}
