import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

export const getEthBalance = (account) => localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString();

// could be cleaned

export const getAccounts = () => {
  return new Promise((res, rej) => {
    localWeb3.eth.getAccounts((error, accounts) => {
      if (error) {
        rej(error);
      } else if (accounts) {
        res({accounts})
      }
    });
  });
}