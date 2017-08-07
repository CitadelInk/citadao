import appContracts from 'app-contracts'
import localWeb3 from "../helpers/web3Helper"
appContracts.setProvider(localWeb3.currentProvider);

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

export const SET_TOKEN_ADRESS = "SET_TOKEN_ADRESS";

export const setTokenAdress = (address) => {
  return {
    type: SET_TOKEN_ADRESS,
    data: address
  };
};

export const SET_CITADEL_ADRESS = "SET_CITADEL_ADRESS";

export const setCitadelAdress = (address) => {
  return {
    type: SET_CITADEL_ADRESS,
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

export const SET_CITADEL_WALLET_ADRESS = "SET_CITADEL_WALLET_ADRESS";

export const setCitadelWalletAddress = (address) => {
  return {
    type: SET_CITADEL_WALLET_ADRESS,
    data: address
  };
};


export const updateBuyPrice = (dispatch) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((data) => data.buyPrice())
    .then((p) => parseFloat(p.toString()))
    .then((p) => dispatch(setBuyPrice(p)));
};

export const initializeContract = (dispatch) => {
  return Promise.all([
    appContracts.MyAdvancedToken.deployed()
      .then((data) => data.totalSupply())
      .then((p) => parseInt(p.toString())) // stupid BigNumber
      .then((p) => dispatch(setTokenSupply(p))),

    updateBuyPrice(dispatch),

    appContracts.MyAdvancedToken.deployed()
    .then((data) => data.owner())
    .then((p) => dispatch(setTokenOwnerAccount(p))),

    appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance.address)
    .then(address => dispatch(setTokenAdress(address)),

    appContracts.Citadel.deployed()
    .then((instance) => instance.address)
    .then(address => dispatch(setCitadelAdress(address))),

    appContracts.Citadel.deployed()
    .then((instance) => instance)
    .then((data) => data.cost_name_update_in_cita())
    .then((p) => dispatch(setNameChangeCostInCita(p))),  

    appContracts.Citadel.deployed()
      .then((instance) => instance.citadel_comptroller())
      .then((data) => dispatch(setCitadelComptrollerAccount(data))),

    appContracts.Citadel.deployed()
      .then((instance) => instance.wallet_address())
      .then((data) => dispatch(setCitadelWalletAddress(data))),
  ]);
};
