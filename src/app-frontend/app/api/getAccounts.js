import appContracts from 'app-contracts'

export const getEthBalance = (account, web3) => {
  return new Promise((res, rej) => {
    web3.eth.getBalance(account, web3.eth.defaultBlock, (error, balance) => {
      if (error) {
        rej(error);
      } else if (balance) {
        var b = web3.fromWei(balance, 'ether').toString();
        res(b)
      }
    });
  });
}

// could be cleaned

export const getAccounts = (web3) => {
  return new Promise((res, rej) => {
    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        rej(error);
      } else if (accounts) {
        res({accounts})
      }
    });
  });
}
