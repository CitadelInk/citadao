import appContracts from 'app-contracts';

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
export const setApprovedReactions = (reactions) => {
  return {
    type: SET_APPROVED_REACTIONS,
    data: {reactions : reactions}
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
  const {wallet, network} = getState();
  const newBuyPrice = network.web3.toBigNumber(wallet.get('newBuyPrice'));
  const account = wallet.get('account');
  return updateBuyPrice(newBuyPrice, account, network.web3).then((data) => {
    return dispatch(setWalletData(data));
  });
};

export const initializeApprovedReactions = () => (dispatch, getState) => {
  const {network} = getState();
  getApprovedReactions(network.web3).then((reactions) => {
    console.log("approved reactions: " + reactions.approvedReactions);
      return dispatch(setApprovedReactions(reactions.approvedReactions));
  })
}


export const addNewApprovedReaction = () => (dispatch, getState) => {
  const {wallet, network} = getState();
  const reaction = wallet.get('newReaction');
  const account = wallet.get('account');
  return(addApprovedReaction(reaction, account, network.web3)).then((data) => {
    return dispatch(initializeApprovedReactions());
  })
}

export const initializeContract = () => (dispatch, getState) => {
  const {network} = getState();
  return Promise.all([
    getAdvancedTokenPublicData(),
    getInkPublicData(),
    getApprovedReactions(network.web3)
  ]).then(([token, ink, reactions]) => {
    dispatch(setWalletData({...token, ...ink}));
    console.log("approved reactions: " + reactions.approvedReactions);
    dispatch(setApprovedReactions(reactions.approvedReactions));
    dispatch(initializeNeededPosts());
  });
};

export const initializeAccounts = (web3) => dispatch => {
  return new Promise((res, rej) => {
    getAccounts(web3).then((accounts) => {
      var accountNamePromises = accounts.accounts.map(acct => {
        return getAccountName(acct, web3)
      })
      Promise.all(accountNamePromises).then(values => {
        var accountNamesResults = values;
        var accountNames = accountNamesResults.map(result => {
          return result.accountName
        })
        var account = accounts.accounts[0];
        Promise.all([
          getEthBalance(account, web3),
          getInkBalance(account)
        ]).then(([ethBalance, inkBalance]) => {
          res({...accounts, accountNames, account, ethBalance, inkBalance}); 
        })
      })
      
    })
  }).then((data) => {
    dispatch(setWalletData(data))
  })  
}

export const setSelectedAccount = (account) => dispatch => {
  return Promise.all([
        getEthBalance(account, web3),
        getInkBalance(account),
        getAccountBioRevisions(account)
      ]) .then(([ethBalance, inkBalance, bioRevisions]) => {
    localWeb3.eth.defaultAccount = account
    return dispatch(setWalletData({account, ...bioRevisions, ethBalance, inkBalance}))
  })
};

export const updateInkBalance = (account) => dispatch => {
  return getInkBalance(account).then(inkBalance => {
    return dispatch(setWalletData({inkBalance}));
  });
};

export const handleBuySubmit = () => (dispatch, getState) => {
  const {wallet, network} = getState();
  const ethToSend = network.web3.toBigNumber(wallet.get('etherToSend'));
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
  console.log("2 handle view responses")
  //responses.map((response) => {
    //dispatch(loadPost(response, false))
  //})
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
  handleViewResponses
};
