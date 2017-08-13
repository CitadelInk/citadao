import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import {
  getAdvancedTokenPublicData,
  getCitadelPublicData,
  getCitaBalance,
} from '../api/getPublicData';
import {
  updateBuyPrice,
  updateBio,
  updateName,
  submitNameChange,
  submitBuy
} from '../api/updatePublicData';
import {getAccounts} from '../api/getAccounts';

export const setBuyPrice = () => (dispatch, getState) => {
  const {wallet} = getState();
  const newBuyPrice = localWeb3.toBigNumber(wallet.get('newBuyPrice'));
  const account = wallet.get('account');
  console.log('account = ' + account + ' newBuyPrice = ' + newBuyPrice);
  return updateBuyPrice(newBuyPrice, account).then((data) => {
    return dispatch(setWalletData(data));
  });
};


export const SET_WALLET_DATA = "SET_WALLET_DATA";

export const setWalletData = (data) => {
  return {
    type: SET_WALLET_DATA,
    data: data
  };
};

export const initializeContract = () => (dispatch) => {
  return Promise.all([
    getAdvancedTokenPublicData(),
    getCitadelPublicData()
  ]).then(([token, citadel]) => dispatch(setWalletData({...token, ...citadel})));
};

export const initializeAccount = (accountIndex, revisionIndex) => dispatch => {
  return new Promise((res, rej) => {
    getAccounts(accountIndex, revisionIndex).then((accountData) => {
      getCitaBalance(accountData.account).then((citaBalance) => {
        res({...accountData, citaBalance})
      });
    });
  }).then((data) => dispatch(setWalletData(data)));
};

export const updateCitaBalance = (account) => dispatch => {
  return getCitaBalance(account).then(citaBalance => {
    return dispatch(setWalletData({citaBalance}));
  });
};

export const submitBio = () => (dispatch, getState) => {
  const {wallet} = getState();
  const account = wallet.get('account');
  const bioInput = wallet.get('bioInput');
  return updateBio(bioInput, account).then(function(tx_id) {
      alert("bio added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
};

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
  initializeAccount,
  updateCitaBalance,
  setWalletData,
  SET_WALLET_DATA,
  setBuyPrice,
  submitBio,
  setName,
  handleSubmit,
  handleBuySubmit,
  handleApproveClicked
};
