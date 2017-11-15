import appContracts from 'app-contracts';

import {
  getInkPublicData
} from '../api/getInkData';

import {
  getAccountInfo,
  getAccountBioRevision,
} from '../api/getInkPostData';

import {
  initializeNeededPosts,
  setAuthorgInfo,
  loadUserData,
  getNextFollowingPosts
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
  getEthBalance,
  getSubmissionReactions,
  getRevisionSectionResponses,
} from '../api/getAccounts';

import {
  getApprovedReactions,
  getApprovedAuthorgReactions
} from '../api/getCitadelGeneralData';

export const SET_APPROVED_REACTIONS = "SET_APPROVED_REACTIONS";
export const setApprovedReactions = (reactions) => {
  return {
    type: SET_APPROVED_REACTIONS,
    data: {reactions : reactions}
  }
}

export const SET_APPROVED_AUTHORG_REACTIONS = "SET_APPROVED_AUTHORG_REACTIONS";
export const setApprovedAuthorgReactions = (reactions) => {
  return {
    type: SET_APPROVED_AUTHORG_REACTIONS,
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
  const {wallet, network} = getState().core;
  const newBuyPrice = network.web3.toBigNumber(wallet.get('newBuyPrice'));
  const account = wallet.get('account');
  return updateBuyPrice(newBuyPrice, account, network.web3).then((data) => {
    return dispatch(setWalletData(data));
  });
};

export const initializeApprovedReactions = () => (dispatch, getState) => {
  const {network} = getState().core;
  getApprovedReactions(network.web3).then((reactions) => {
      return dispatch(setApprovedReactions(reactions.approvedReactions));
  })
}


export const addNewApprovedReaction = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const reaction = wallet.get('newReaction');
  const account = wallet.get('account');
  return(addApprovedReaction(reaction, account, network.web3)).then((data) => {
    return dispatch(initializeApprovedReactions());
  })
}

export const initializeContract = () => (dispatch, getState) => {
  const {network} = getState().core;
    return new Promise((res, rej) => { Promise.all([
      //getAdvancedTokenPublicData(),
      getInkPublicData(),
      getApprovedReactions(network.web3),
      getApprovedAuthorgReactions(network.web3)
    ]).then(([ink, reactions, authorgReactions]) => {
      dispatch(setWalletData({...ink}));
      dispatch(setApprovedReactions(reactions.approvedReactions));
      dispatch(setApprovedAuthorgReactions(authorgReactions.approvedAuthorgReactions));
      dispatch(initializeNeededPosts()).then(() => {
        res({done : true})
      })
    });
  })
};

export const initializeAccounts = (web3) => dispatch => {
  return new Promise((res, rej) => {
    getAccounts(web3).then((accounts) => {
        var account = accounts.accounts[0];
        if (account) {
          dispatch(loadUserData(account, true, true));
          Promise.all([
            getEthBalance(account, web3),
            //getInkBalance(account)
          ]).then(([ethBalance, inkBalance]) => {
            res({...accounts, account, ethBalance/*, inkBalance*/}); 
          })
        }
      })
  }).then((data) => {

    dispatch(setWalletData(data))
  })  
}

export const setSelectedAccount = (account) => (dispatch, getState) => {
  const {network} = getState().core;
  return Promise.all([
        getEthBalance(account, network.web3),
       // getInkBalance(account)
      ]) .then(([ethBalance/*, inkBalance*/]) => {
      network.web3.eth.defaultAccount = account

    return dispatch(setWalletData({account, ethBalance/*, inkBalance*/}))
  })
};

export const updateInkBalance = (account) => dispatch => {
  /*return getInkBalance(account).then(inkBalance => {
    return dispatch(setWalletData({inkBalance}));
  });*/
};

export const updateEthBalance = (account) => (dispatch, getState) => {
  const {network} = getState().core;
  return getEthBalance(account, network.web3).then(ethBalance => {
    return dispatch(setWalletData({ethBalance}));
  });
};

export const handleBuySubmit = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const ethToSend = network.web3.toBigNumber(wallet.get('etherToSend'));
  dispatch(handleBuy(ethToSend));
};


export const handleBuy = (ethToSend) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  const tokenOwnerAccount = wallet.get('tokenOwnerAccount');
  submitBuy(ethToSend, account, tokenOwnerAccount).then(() => {
    alert("Transaction successful - Ink bought");
    dispatch(updateInkBalance(account));
  }).catch(function(e) {
    alert("error - " + e);
  });
}

export const handleQuickStart = () => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  const account = wallet.get('account');
  dispatch(giveEther(1));
  setTimeout(function () {      
    dispatch(updateEthBalance(account))
  }, 2000); 
}

export const giveEther = (amount, callback) => (dispatch, getState) => {
  const {wallet, network} = getState().core;
  var ethamount =  network.web3.toWei(amount, 'ether')
  const account = wallet.get('account');
  const tokenOwner = wallet.get('inkComptrollerAccount');

  var xhr = new XMLHttpRequest();
  var url = network.web3.currentProvider.host;
  // hacky bullshit!!!
  if (url == undefined) {
    url = window.location.href.replace(".ink", ".ink:8545")
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          dispatch(callback())
      }
  };


  var xx = {
    "jsonrpc":"2.0",
    "method":"eth_sendTransaction",
    "params": [{"from":tokenOwner, "to":account, "value": network.web3.toBigNumber(ethamount).toNumber()}], 
    "id":1};

  var data = JSON.stringify(xx);
  console.log(data);
  xhr.send(data);
};

export default {
  initializeContract,
  initializeAccounts,
  updateInkBalance,
  setWalletData,
  SET_WALLET_DATA,
  SET_APPROVED_REACTIONS,
  SET_APPROVED_AUTHORG_REACTIONS,
  setBuyPrice,
  handleBuySubmit,
  setSelectedAccount,
  giveEther,
  handleQuickStart
};
