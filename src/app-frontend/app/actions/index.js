import contractPublicData from "./contractPublicData.js";
import uiActions from './uiActions';
import getPostData from './getPostData';
import setPostData from './setPostData';
import setupWeb3 from './networkActions';

export default {
  ...uiActions,
  ...contractPublicData,
  ...getPostData,
  ...setPostData,
  ...setupWeb3
};