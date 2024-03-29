import Web3 from 'web3';
import config from "../config.json"
import appContracts from 'app-contracts';

import {
  initializeContract,
  initializeAccounts ,
  startGettingPosts 
} from './contractPublicData'


export const WEB_SETUP_COMPLETE = 'network/WEB_SETUP_COMPLETE';

export function setupWeb3() {
    console.log('setupWeb3()');
    
    return function(dispatch) {
      let web3Provider;

      const isChrome = true;///Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const hasMetamask = typeof web3 !== 'undefined'

      if ((hasMetamask && isChrome)) {
        console.log('using injected web3 instance');
        web3Provider = new Web3(web3.currentProvider);
      }

      // $AS WE no longer support connecting to the any sort of debug network! You should be always testing 
      // with metamask
      // else {
      //   console.log('using own web3 instance');
      //   console.log(config)
      //   const provider = new Web3.providers.HttpProvider(`http://${config.Server}:8545`)
      //   web3Provider = new Web3(provider);
      // }

      if(!web3Provider || !web3Provider.currentProvider.isConnected()) return;
      
      appContracts.setProvider(web3Provider.currentProvider);

      console.log('web3 provider:', web3Provider.currentProvider !== undefined);
      console.log('web3 provider:', web3Provider);
      console.log('web3 connected: ', web3Provider.currentProvider.isConnected())
      dispatch({
        type: WEB_SETUP_COMPLETE,
        data: web3Provider
      });

        // can't run this in mist as of yet as we are not deployed to a public network
        if (typeof mist === "undefined") {
          console.info("initialize contracts.")
          dispatch(initializeContract()).then(() => {
            console.info("initialize accounts.")
            dispatch(initializeAccounts(web3Provider)).then(() => {
              console.info("start getting posts.")
              dispatch(startGettingPosts())
            })
          })
        }
  
    };
  }


  export default {
    WEB_SETUP_COMPLETE,
    setupWeb3
  }