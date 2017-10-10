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
  loadPost,
  loadUserData,
  initializeTestTypedRevisions
} from './getPostData';

import {
  getAccountInfo,
  getAccountBioRevisions,
  getAccountBioRevision,
} from '../api/getInkPostData';

import { Link, push } from 'redux-little-router';

export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const gotoUserPage  = (user) => dispatch =>  {  
  dispatch(loadUserData(user, true));
  return dispatch(navigatePage({page:'user', route:'user\/' + user}));
}

export const gotoPost = (authorg, subHash, revHash) => (dispatch) => {
  dispatch(loadPost(authorg, subHash, revHash, undefined, true, true))
  return dispatch(push("/post/authorg/" + authorg + "/sub/" + subHash + "/rev/" + revHash))
}

export const gotoHomePage = () => dispatch => {
  dispatch(initializeTestTypedRevisions());
  return dispatch(push('/'));
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
  setBuyMore,
  gotoPost,
  gotoHomePage
};
