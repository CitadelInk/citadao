import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";
import {getAdvancedTokenPublicData, getCitadelPublicData} from '../api/getPublicData';

export const SET_TOKEN_SUPPLY = "SET_TOKEN_SUPPLY";

export const setTokenSupply = (tokenSupply) {
  return {
    type: SET_TOKEN_SUPPLY,
    data: tokenSupply
  };
};

export const SET_BUY_PRICE = "SET_BUY_PRICE";

export const setBuyPrice = (buyPrice) => {
  return {
    type: SET_BUY_PRICE,
    data: buyPrice
  };
};

export const SET_TOKEN_OWNER_ACCONT = "SET_TOKEN_OWNER_ACCONT";

export const setTokenOwnerAccount = (tokenOwnerAccount) => {
  return {
    type: SET_TOKEN_OWNER_ACCONT,
    data: tokenOwnerAccount
  };
};

export const SET_TOKEN_ADDRESS = "SET_TOKEN_ADDRESS";

export const setTokenAdress = (address) => {
  return {
    type: SET_TOKEN_ADRESS,
    data: address
  };
};

export const SET_CITADEL_ADDRESS = "SET_CITADEL_ADDRESS";

export const setCitadelAddress = (address) => {
  return {
    type: SET_CITADEL_ADDRESS,
    data: address
  };
};

export const SET_NAME_CHANGE_COST_IN_CITA = "SET_NAME_CHANGE_COST_IN_CITA";

export const setNameChangeCostInCita = (nameChangeCostInCita) => {
  return {
    type: SET_NAME_CHANGE_COST_IN_CITA,
    data: nameChangeCostInCita
  };
};


export const SET_CITADEL_COMPTROLLER_ACCOUNT = "SET_CITADEL_COMPTROLLER_ACCOUNT";

export const setCitadelComptrollerAccount = (account) => {
  return {
    type: SET_CITADEL_COMPTROLLER_ACCOUNT,
    data: account
  };
};

export const SET_CITADEL_WALLET_ADDRESS = "SET_CITADEL_WALLET_ADRESS";

export const setCitadelWalletAddress = (address) => {
  return {
    type: SET_CITADEL_WALLET_ADRESS,
    data: address
  };
};

export const SET_WALLET_DATA = "SET_WALLET_DATA";

export const setWalletData = (data) => {
  return {
    type: SET_WALLET_DATA,
    data: data
  };
};

export const initializeContract = (dispatch) => {
  return Promise.all([
    getAdvancedTokenPublicData(),
    getCitadelPublicData()
  ]).then(([token, citadel]) => dispatch(setWalletData({...token, ...citadel})));
};
