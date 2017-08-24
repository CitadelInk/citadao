import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import {
  getAdvancedTokenPublicData,
  getCitadelPublicData,
  getCitaBalance,
} from '../api/getPublicData';
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
  getSubmission,
  getSubmissions,
  getAccountBioData,
  getAccountBioRevisions,
  getAccountBioRevision,
  getAccountName,
  getEthBalance,
  getApprovedReactions,
  getSubmissionReactions
} from '../api/getAccounts';

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

export const SET_SUBMISSION = "SET_SUBMISSION";
export const setSubmission = (data) => {
  return {
    type: SET_SUBMISSION,
    data: data
  }
}

export const SET_SUBMISSION_AUTHORG_NAME = "SET_SUBMISSION_AUTHORG_NAME";
export const setSubmissionAuthorgName = (subHash, name) => {
  return {
    type: SET_SUBMISSION_AUTHORG_NAME,
    data: {subHash : subHash, name: name}
  }
}

export const SET_SUBMISSION_REACTIONS = "SET_SUBMISSION_REACTIONS";
export const setSubmissionReactions = (subHash, reactions) => {
  return {
    type: SET_SUBMISSION_REACTIONS,
    data: {subHash : subHash, reactions : reactions}
  }
}

export const setBuyPrice = () => (dispatch, getState) => {
  const {wallet} = getState();
  const newBuyPrice = localWeb3.toBigNumber(wallet.get('newBuyPrice'));
  const account = wallet.get('account');
  console.log('account = ' + account + ' newBuyPrice = ' + newBuyPrice);
  return updateBuyPrice(newBuyPrice, account).then((data) => {
    return dispatch(setWalletData(data));
  });
};

export const initializeApprovedReactions = () => (dispatch) => {
  getApprovedReactions().then((reactions) => {
    console.log("initializeApprovedReactions - approved reactions: " + reactions.approvedReactions);
      dispatch(initializeTestTypedSubmissions());
      return dispatch(setApprovedReactions(reactions.approvedReactions));
  })
}

export const initializeNeededSubmissions = () => (dispatch, getState) => {
  const {ui} = getState();
  if(ui.get('page') === 'home') {
    dispatch(initializeTestTypedSubmissions());
  } else if (ui.get('page') === 'post') {
    var route = ui.get('route');
    var splitRoute = route.split('\/'); 
    dispatch(loadPost(splitRoute[2], splitRoute[4]));
  }
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
    getCitadelPublicData(),
    getApprovedReactions()
  ]).then(([token, citadel, reactions]) => {
    dispatch(setWalletData({...token, ...citadel}));
    dispatch(setApprovedReactions(reactions.approvedReactions));
    dispatch(initializeNeededSubmissions());
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
          getCitaBalance(account)
        ]).then(([ethBalance, citaBalance]) => {
          res({...accounts, accountNames, account, ethBalance, citaBalance}); 
        })
      })
      
    })
  }).then((data) => {
    dispatch(setWalletData(data))
  })  
}



export const loadPost = (submissionHash, revisionHash) => (dispatch, getState) => {
  const {approvedReactions} = getState();
  return getSubmission(submissionHash).then(result => {
    dispatch(setSubmission({subHash: submissionHash, submissionAuthorg: result.submissionAuthorg, submissionHash: result.submissionHash, revisionHash: result.revisionHash, title: result.submissionTitle, text: result.submissionText, revisionReactionReactors: result.revisionReactionReactors}))
    getAccountName(result.submissionAuthorg).then((name) => {
      dispatch(setSubmissionAuthorgName(submissionHash, name.accountName));
    })
    getSubmissionReactions(submissionHash, result.submissionAuthorg, approvedReactions).then((reactions) => {
      dispatch(setSubmissionReactions(submissionHash, reactions.revisionReactionReactors))
    })
  })
}

export const initializeTestTypedSubmissions = () => dispatch => {
  return new Promise((res, rej) => {
    getSubmissions().then((submissions) => {
      var submissionPromises = submissions.allSubmissionsTest.map(sub => {
        return dispatch(loadPost(sub, sub));
      })
    })
  })
}

export const setSelectedAccount = (account) => dispatch => {
  return Promise.all([
        getEthBalance(account),
        getCitaBalance(account),
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

export const updateCitaBalance = (account) => dispatch => {
  return getCitaBalance(account).then(citaBalance => {
    return dispatch(setWalletData({citaBalance}));
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
  var postJson = {"authorg" : account, "title" : postTitleInput, "text" : postTextInput}
  return post(JSON.stringify(postJson), account).then(function(tx_id) {
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

export const setName = () => (dispatch, getState) => {
  const {wallet} = getState();
  return updateName(wallet.get('account'))
    .then(data => dispatch(setWalletData(data)));
};

export const handleSubmit = () => (dispatch, getState) => {
  const {wallet} = getState();
  const name = wallet.get('newName');
  const account = wallet.get('account');
  return submitNameChange(name, account)
    .then(() => dispatch(setName()))
    .then(() => updateCitaBalance(account));
};

export const handleBuySubmit = () => (dispatch, getState) => {
  const {wallet} = getState();
  const ethToSend = localWeb3.toBigNumber(wallet.get('etherToSend'));
  const account = wallet.get('account');
  const tokenOwnerAccount = wallet.get('tokenOwnerAccount');
  console.log("from: " + account + " - to: " + tokenOwnerAccount);
  submitBuy(ethToSend, account, tokenOwnerAccount).then(() => {
    alert("Transaction successful - CITA bought");
    dispatch(updateCitaBalance(account));
  }).catch(function(e) {
    alert("error - " + e);
  });
};

export const handleApproveClicked = () => (dispatch, getState) => {
  const {wallet} = getState();
  const name = wallet.get('newName');
  const account = wallet.get('account');
  const citadelAddress = wallet.get('citadelAddress');
  const citaBalance = wallet.get('citaBalance');
  appContracts.MyAdvancedToken.deployed()
  .then((instance) => {
    return instance.approve.sendTransaction(citadelAddress,
      citaBalance,
      {from : account});
  }).then(function(tx_id) {
    alert("Citadel Contract address approved as spender.");
  }).catch(function(e) {
    alert("error - " + e);
  });
};

export default {
  initializeContract,
  initializeAccounts,
  updateCitaBalance,
  setWalletData,
  SET_WALLET_DATA,
  SET_SUBMISSIONS,
  SET_APPROVED_REACTIONS,
  SET_SUBMISSION,
  SET_SUBMISSION_AUTHORG_NAME,
  SET_SUBMISSION_REACTIONS,
  setBuyPrice,
  submitBio,
  submitPost,
  setName,
  handleSubmit,
  handleBuySubmit,
  handleApproveClicked,
  setSelectedAccount,
  setSelectedBioRevision,
  submitReaction,
  addNewApprovedReaction,
  setApprovedReactions,
  loadPost
};
