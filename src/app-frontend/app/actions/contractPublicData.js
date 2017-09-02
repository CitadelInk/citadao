import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import {
  getAdvancedTokenPublicData,
  getInkBalance,
} from '../api/getTokenData';

import {
  getInkPublicData,
} from '../api/getInkData';

import {
  getAccountName
} from '../api/getInkPostData';

import {
  initializeNeededPosts
} from './getPostData'

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
  getAccounts, 
  getRevision,
  getAccountBioData,
  getAccountBioRevisions,
  getAccountBioRevision,
  getEthBalance,
  getSubmissionReactions,
  getRevisionSectionResponses,
  getRevisionTime
} from '../api/getAccounts';

import {
  getApprovedReactions
} from '../api/getCitadelGeneralData';

export const SET_APPROVED_REACTIONS = "SET_APPROVED_REACTIONS";
export const setApprovedReactions = (data) => {
  return {
    type: SET_APPROVED_REACTIONS,
    data: data
  }
}

export const SET_WALLET_DATA = "SET_WALLET_DATA";
export const setWalletData = (data) => {
  return {
    type: SET_WALLET_DATA,
    data: data
  };
};

export const SET_SUBMISSIONS = "SET_SUBMISSIONS";
export const setSubmissions = (data) => {
  return {
    type: SET_SUBMISSIONS,
    data: data
  }
}

export const SET_REVISION_SWARM_DATA = "SET_REVISION_SWARM_DATA";
export const setRevisionSwarmData = (data) => {
  return {
    type: SET_REVISION_SWARM_DATA,
    data: data
  }
}

export const SET_REVISION_AUTHORG_NAME = "SET_REVISION_AUTHORG_NAME";
export const setRevisionAuthorgName = (subHash, name) => {
  return {
    type: SET_REVISION_AUTHORG_NAME,
    data: {revHash : revHash, name: name}
  }
}

export const SET_REVISION_REACTIONS = "SET_REVISION_REACTIONS";
export const setRevisionReactions = (revHash, reactions) => {
  return {
    type: SET_REVISION_REACTIONS,
    data: {revHash : revHash, reactions : reactions}
  }
}

export const SET_REVISION_SECTION_RESPONSES = "SET_REVISION_SECTION_RESPONSES";
export const setRevisionSectionResponses = (revHash, sectionIndex, responses) => {
  console.log("SET REVISION SECTION RESPONSES")
  return {
    type: SET_REVISION_SECTION_RESPONSES,
    data: {revHash : revHash, sectionIndex : sectionIndex, responses : responses}
  }
}

export const SET_REVISION_TIME = "SET_REVISION_TIME";
export const setRevisionTime = (revHash, revisionTime) => {
  console.log("SET REVISION TIME")
  return {
    type: SET_REVISION_TIME,
    data: {revHash : revHash, revisionTime : revisionTime}
  }
}

export const SET_SUBMISSION_REVISIONS = "SET_SUBMISSION_REVISIONS";

export const setBuyPrice = () => (dispatch, getState) => {
  const {wallet} = getState();
  const newBuyPrice = localWeb3.toBigNumber(wallet.get('newBuyPrice'));
  const account = wallet.get('account');
  return updateBuyPrice(newBuyPrice, account).then((data) => {
    return dispatch(setWalletData(data));
  });
};

export const initializeApprovedReactions = () => (dispatch) => {
  getApprovedReactions().then((reactions) => {
    return dispatch(setApprovedReactions(reactions.approvedReactions));
  })
}


export const addNewApprovedReaction = () => (dispatch, getState) => {
  const {wallet} = getState();
  const reaction = wallet.get('newReaction');
  const account = wallet.get('account');
  return(addApprovedReaction(reaction, account)).then((data) => {
    return dispatch(initializeApprovedReactions());
  })
}


export const initializeContract = () => (dispatch) => {
  return Promise.all([
    getAdvancedTokenPublicData(),
    getInkPublicData(),
    getApprovedReactions()
  ]).then(([token, ink, reactions]) => {
    dispatch(setWalletData({...token, ...ink}));
    dispatch(setApprovedReactions(reactions.approvedReactions));
    dispatch(initializeNeededPosts());
  });
};

export const initializeAccounts = () => dispatch => {
  return new Promise((res, rej) => {
    getAccounts().then((accounts) => {
      var accountNamePromises = accounts.accounts.map(acct => {
        return getAccountName(acct)
      })
      Promise.all(accountNamePromises).then(values => {
        var accountNamesResults = values;
        var accountNames = accountNamesResults.map(result => {
          return result.accountName
        })
        var account = accounts.accounts[0];
        Promise.all([
          getEthBalance(account),
          getInkBalance(account)
        ]).then(([ethBalance, citaBalance]) => {
          res({...accounts, accountNames, account, ethBalance, citaBalance}); 
        })
      })
      
    })
  }).then((data) => {
    dispatch(setWalletData(data))
  })  
}



export const loadPost = (authorgAddress, submissionHash, revisionHash, index, firstLevel = true) => (dispatch, getState) => {
  console.log("LOAD POST")
  const {approvedReactions} = getState();
  return getRevisionFromSwarm(revisionHash).then(result => {
    dispatch(setRevisionSwarmData(authorgAddress, submissionHash, revisionHash, 
      {
        revisionSwarmAuthorgHash: result.authorgHash, 
        revisionSwarmTitle: result.title, 
        revisionSwarmText: result.text, 
      }
    ))
    if (firstLevel && result.revisionSwarmText) {
      result.revisionSwarmText.map((section, i) => {        
        try {
          var json = JSON.parse(section)
          if(json) {
            if(json.reference) {
              dispatch(loadPost(json.reference.authorgAddress, json.reference.submissionHash, json.reference.revisionHash, -1, false))
            }
          }
        } catch (e) {

        }
      })       
    }
    getRevisionTime(authorgAddress, submissionHash, revisionHash).then((revisionTime) => {
      dispatch(setRevisionTime(authorgAddress, submissionHash, revisionHash, revisionTime))
    })
    getAccountName(authorgAddress, submissionHash, revisionHash).then((name) => {
      dispatch(setRevisionAuthorgName(authorgAddress, submissionHash, revisionHash, name.accountName));
    })
    getRevisionReactions(authorgAddress, submissionHash, revisionHash, approvedReactions).then((reactions) => {
      dispatch(setRevisionReactions(authorgAddress, submissionHash, revisionHash, reactions.revisionReactionReactors))
    })
  })
}

export const setSelectedAccount = (account) => dispatch => {
  return Promise.all([
        getEthBalance(account),
        getInkBalance(account),
        getAccountBioRevisions(account)
      ]) .then(([ethBalance, citaBalance, bioRevisions]) => {
    localWeb3.eth.defaultAccount = account
    return dispatch(setWalletData({account, ...bioRevisions, ethBalance, citaBalance}))
  })
};

export const setSelectedBioRevision = (selectedRevision) => dispatch => {
  return getAccountBioRevision(selectedRevision).then((revision) => {
    return dispatch(setWalletData({selectedBioRevision : selectedRevision, selectedBioRevisionValue : revision}))
  })
};

export const updateInkBalance = (account) => dispatch => {
  return getInkBalance(account).then(inkBalance => {
    return dispatch(setWalletData({inkBalance}));
  });
};

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

  console.log("postTextInput: " + postTextInput);

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

export const handleBuySubmit = () => (dispatch, getState) => {
  const {wallet} = getState();
  const ethToSend = localWeb3.toBigNumber(wallet.get('etherToSend'));
  const account = wallet.get('account');
  const tokenOwnerAccount = wallet.get('tokenOwnerAccount');
  submitBuy(ethToSend, account, tokenOwnerAccount).then(() => {
    alert("Transaction successful - Ink bought");
    dispatch(updateInkBalance(account));
  }).catch(function(e) {
    alert("error - " + e);
  });
};

export const handleViewResponses = (responses) => (dispatch) => {
  responses.map((response) => {
    dispatch(loadPost(response, false))
  })
  return dispatch(setWalletData({selectedResponses : responses}))
}

export default {
  initializeContract,
  initializeAccounts,
  updateInkBalance,
  setWalletData,
  SET_WALLET_DATA,
  SET_SUBMISSIONS,
  SET_APPROVED_REACTIONS,
  SET_REVISION_SWARM_DATA,
  SET_REVISION_AUTHORG_NAME,
  SET_REVISION_REACTIONS,
  SET_REVISION_SECTION_RESPONSES,
  setBuyPrice,
  submitBio,
  submitPost,
  handleBuySubmit,
  setSelectedAccount,
  setSelectedBioRevision,
  submitReaction,
  addNewApprovedReaction,
  setApprovedReactions,
  loadPost,
  handleViewResponses
};
