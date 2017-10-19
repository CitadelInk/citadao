import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

import {
  requestResponse,
  getPostResponseRequestOfferers,
  getResponseRequestReceipt,
  collectBounty,
  withdrawBounty,
  checkUserReferenceAgainstPost,
  checkCitadelUserReferenceAgainstPost,
  getCitadelResponseRequestInkAddress
} from '../api/citadelResponseRequestCalls'

import {
  loadPost
} from './getPostData'


export const SET_REVISION_REQUEST_RESPONSE_KEYS = "SET_REVISION_REQUEST_RESPONSE_KEYS";
export const setRevisionRequestResponseKeys = (authAdd, subHash, revHash, requestResponseOfferers, requestResponseRecipients) => {
  return {
    type: SET_REVISION_REQUEST_RESPONSE_KEYS,
    data: {authAdd, subHash, revHash, requestResponseOfferers, requestResponseRecipients}
  }
}

export const SET_REVISION_REQUEST_RESPONSE_RECEIPT = "SET_REVISION_REQUEST_RESPONSE_RECEIPT";
export const setRevisionResponseRequestReceipt = (authAdd, subHash, revHash, offerer, recipient, exists, timestamp, bounty, collected, completed, withdrawn) => {
  return {
    type: SET_REVISION_REQUEST_RESPONSE_RECEIPT,
    data: {authAdd, subHash, revHash, offerer, recipient, receipt: {exists, timestamp, bounty, collected, completed, withdrawn}}
  }
}

export const submitResponseRequest = (recipientUser, postUser, postSubmission, postRevision, bountyValue) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    var convertedBounty = web3.toWei(bountyValue, "ether");

    return requestResponse(account, recipientUser, postUser, postSubmission, postRevision, convertedBounty).then(function(resulty) {
      var hasReloaded = false;
      resulty.event.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(loadPost(postUser, postSubmission, postRevision, undefined, true, true));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(loadPost(postUser, postSubmission, postRevision, undefined, true, true));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
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
      var hasReloaded = false;
      resulty.event.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(loadRequestResponse(postUser, postSubmission, postRevision, offererUser, account));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(loadRequestResponse(postUser, postSubmission, postRevision, offererUser, account));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
    });
  }
}

export const withdrawResponseRequestBounty = (recipientUser, postUser, postSubmission, postRevision) => (dispatch, getState) => {
  const {wallet} = getState().core;
  const account = wallet.get('account');
  if (!account) {
    alert("Please sign into MetaMask and reload the page. Make sure MetaMask is set to correct Custom RPC: http://citadel.ink:8545/")
  } else {
    return withdrawBounty(account, recipientUser, postUser, postSubmission, postRevision).then(function(resulty) {
      var hasReloaded = false;
      resulty.event.watch(function(error,result){
        if (!error && result.transactionHash === resulty.tx_id) {
          dispatch(loadRequestResponse(postUser, postSubmission, postRevision, account, recipientUser));
          hasReloaded = true;
        }
      });
      setTimeout(function() {
        if (!hasReloaded) {
          dispatch(loadRequestResponse(postUser, postSubmission, postRevision, account, recipientUser));
        }
      }, 3000);
    }).catch(function(e) {
      console.error("error - " + e);
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

export const loadRequestResponse = (postUser, postSubmission, postRevision, offerer, recipient) => (dispatch, getState) => {
  const {network, wallet} = getState().core;
  var account = wallet.get('account');
  getResponseRequestReceipt(postUser, postSubmission, postRevision, offerer, recipient).then((result) => {
    var convertedBounty = network.web3.fromWei(result.bounty, "ether");
    console.log("converted bounty = " + convertedBounty);
    dispatch(setRevisionResponseRequestReceipt(postUser, postSubmission, postRevision, offerer, recipient, result.exists, result.timestamp, convertedBounty, result.collected, result.completed, result.withdrawn))
  })
}


export default {
  submitResponseRequest,
  loadPostResponseRequests,
  collectResponseRequestBounty,
  withdrawResponseRequestBounty,
  checkIfUserReferencesPost,
  checkCitadelIfUserReferencesPost,
  checkCitadelResponseRequestInkAddress,
  SET_REVISION_REQUEST_RESPONSE_KEYS,
  SET_REVISION_REQUEST_RESPONSE_RECEIPT
}
