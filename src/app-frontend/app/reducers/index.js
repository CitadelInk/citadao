import { combineReducers } from 'redux';
import { Map } from 'immutable';
import {
  SET_CITADEL_WALLET_ADRESS,
  SET_CITADEL_COMPTROLLER_ACCOUNT,
  SET_NAME_CHANGE_COST_IN_CITA,
  SET_CITADEL_ADRESS,
  SET_TOKEN_ADRESS,
  SET_TOKEN_OWNER_ACCONT,
  SET_BUY_PRICE,
  SET_TOKEN_SUPPLY
} from '../actions';

const wallet = (state = Map({
  accountIndex: 1,
  account: null,
  tokenSupply: 0,
  citaBalance: 0,
  ethBalance: 0,
  citaBuyPrice: 0.0,
  etherToSend: 0,
  newBuyPrice: 0,
  nameChangeCostInCita: 0,
  citadelName: '',
  newName: '',
  tokenOwnerAccount: null,
  citadelComptrollerAccount: null,
  tokenAddress: null,
  citadelAddress: null,
  citadelWalletAddress: null,
  bioRevisions: [],
  bioRevisionResults: [],
  selectedBioRevisionIndex: 0,
  bioInput: ''
}), action) => {
  switch (action.type) {
    case SET_TOKEN_ADRESS:
      return state.set("tokenAddress", action.data);
    case SET_TOKEN_OWNER_ACCONT:
      return state.set("tokenOwnerAccount", action.data);
    case SET_BUY_PRICE:
      return state.set("citaBuyPrice", action.data);
    case SET_TOKEN_SUPPLY:
      return state.set("tokenSupply", action.data);
    case SET_CITADEL_ADRESS:
      return state.set("citadelAddress", action.data);
    case SET_NAME_CHANGE_COST_IN_CITA:
      return state.set("nameChangeCostInCita", action.data);
    case SET_CITADEL_COMPTROLLER_ACCOUNT:
      return state.set("citadelComptrollerAccount", action.data);
    case SET_CITADEL_WALLET_ADRESS:
      return state.set("citadelWalletAddress", action.data);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  wallet
});

export default rootReducer;
