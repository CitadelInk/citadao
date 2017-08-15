import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const updateBuyPrice = (newBuyPrice, account) => {
  console.log("update buy price - newBuyPrice=" + newBuyPrice)
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance.setPrices.sendTransaction(localWeb3.toBigNumber('0'), newBuyPrice, {from : account})).then(function(tx_id) {
      return appContracts.MyAdvancedToken.deployed()
        .then((data) => data.buyPrice())
        .then((p) => parseFloat(p.toString()))
        .then((p) => {return {citaBuyPrice : p}});  
    }).catch(function(e) {
      alert("error - " + e);
    })
};

export const updateBio = (bioInput, account) => {
  return new Promise((res, rej) => {
    localWeb3.bzz.put(bioInput, (error, hash) => {
      appContracts.Citadel.deployed()
      .then((instance) => {
        instance.submitBioRevision.sendTransaction('0x' + hash, {from : account, gas : 200000}).then((tx_id) => {
          res(tx_id)
        }).catch(rej);
      });
    });
  }); 
}

export const submitBuy = (eth, account, tokenOwnerAccount) => {
  console.log("submitBuy - from: " + account + " - to: " + tokenOwnerAccount + " - amount: " + eth);
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => {
      return instance.buy.sendTransaction({
        from : account,
        to : tokenOwnerAccount, 
        value : eth
      });
    });
};