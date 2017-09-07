import Web3 from 'web3';
import config from "../config.json"
import appContracts from 'app-contracts';

import {
  initializeContract,
  initializeAccounts  
} from './contractPublicData'


export const WEB_SETUP_COMPLETE = 'network/WEB_SETUP_COMPLETE';

export function setupWeb3() {
    console.log('setupWeb3()');
    return function(dispatch) {
      let web3Provider;
      if(typeof web3 !== 'undefined') {
        console.log('using injected web3 instance');
        web3Provider = new Web3(web3.currentProvider);
      }
      else {
        console.log('using own web3 instance');
        console.log(config)
        const provider = new Web3.providers.HttpProvider(`http://${config.Server}:8545`)
        web3Provider = new Web3(provider);
      }

      if(!web3Provider) return;
      
      appContracts.setProvider(web3Provider.currentProvider);
      

      console.log('web3 provider:', web3Provider.currentProvider !== undefined);
      console.log('web3 provider:', web3Provider);
      dispatch({
        type: WEB_SETUP_COMPLETE,
        data: web3Provider
      });

        // can't run this in mist as of yet as we are not deployed to a public network
        // SOON! Test against local browser to see if this works! Should see account - 1000 or whatever was reflected in the deplpoy
        if (typeof mist === "undefined") {
            dispatch(initializeContract());
        }
  
        dispatch(initializeAccounts(web3Provider));
    };
  }


  export default {
    WEB_SETUP_COMPLETE,
    setupWeb3
  }