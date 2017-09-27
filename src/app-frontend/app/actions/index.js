import contractPublicData from "./contractPublicData.js";
import uiActions from './uiActions';
import getPostData from './getPostData';
import setPostData from './setPostData';
import setupWeb3 from './networkActions';
import router from './routerActions';

export default {
  ...uiActions,
  ...contractPublicData,
  ...getPostData,
  ...setPostData,
  ...setupWeb3,
  ...router
};