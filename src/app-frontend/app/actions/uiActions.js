import {
  getAccounts, 
  getAccountBioData,
  getEthBalance
} from '../api/getAccounts';

import {
  setWalletData,
  setSelectedBioRevision
} from './contractPublicData';

import {
  doFocusedLoad,
  loadUserData,
  initializeTestTypedRevisions
} from './getPostData';

import {
  getAccountBioRevision,
} from '../api/getInkPostData';

import { Link, push } from 'redux-little-router';

export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const gotoUserPage  = (user) => dispatch =>  {  
  dispatch(clearUISpecifics());
  dispatch(loadUserData(user, true));
  return dispatch(push('/user/' + user));
}

export const gotoUserPageRev  = (user, rev) => dispatch =>  {  
  dispatch(clearUISpecifics());
  dispatch(loadUserData(user, true, false, rev));
  return dispatch(push('/user/' + user +'/rev/' + rev));
}

export const gotoPost = (authorg, subHash, revHash) => (dispatch) => {
  dispatch(clearUISpecifics());
  dispatch(doFocusedLoad(authorg, subHash, revHash, undefined, true, true))
  return dispatch(push("/post/authorg/" + authorg + "/sub/" + subHash + "/rev/" + revHash))
}

export const gotoHomePage = () => dispatch => {
  dispatch(initializeTestTypedRevisions());
  return dispatch(push('/'));
}

export const clearUISpecifics = () => dispatch => {
  dispatch(setWalletData({selectedReactionHash : '', selectedResponses : null}))
} 

export const setBuyMore = (active) => dispatch => {
  return dispatch(
    setWalletData({
      buyMoreActive: active
    })
  );
}

export const navigatePage = (data) => {
  return {
    type: NAVIGATE_PAGE,
    data
  };
};

export default {
  NAVIGATE_PAGE,
  navigatePage,
  gotoUserPage,
  gotoUserPageRev,
  setBuyMore,
  gotoPost,
  gotoHomePage
};
