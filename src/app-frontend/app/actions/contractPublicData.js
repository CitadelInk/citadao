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

export const updateInkBalance = (account) => dispatch => {
  return getInkBalance(account).then(inkBalance => {
    return dispatch(setWalletData({inkBalance}));
  });
};

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
  SET_APPROVED_REACTIONS,
  setBuyPrice,
  handleBuySubmit,
  setSelectedAccount,
  addNewApprovedReaction,
  setApprovedReactions,
  handleViewResponses
};
