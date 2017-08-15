import {
  getAccounts, 
  getAccountBioData,
  getAccountBioRevisions,
  getAccountBioRevision,
  getAccountName,
  getEthBalance
} from '../api/getAccounts';

import {
  setWalletData,
  setSelectedBioRevision
} from './contractPublicData'

export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const gotoUserPage  = (user) => dispatch =>  {
  dispatch(navigatePage({page:'user',route:'\/user\/' + user}))
  return Promise.all([
        getAccountBioRevisions(user)
    ]).then(([bioRevisions]) => {
      var revisions = bioRevisions.bioRevisions;
      if(revisions.length > 0) {
        console.log("bio revisionslength > 0")
        dispatch(setSelectedBioRevision(revisions[revisions.length - 1])); // most recent
      }
      return dispatch(setWalletData({...bioRevisions}))
  });
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
  gotoUserPage
};
