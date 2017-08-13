import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const updateBuyPrice = (newBuyPrice, account) => {
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
  console.log('bio value = ' + bioInput);
  return localWeb3.bzz.put(bioInput, (error, hash) => {
    return appContracts.Citadel.deployed()
    .then((instance) => {
      return instance.submitBioRevision.sendTransaction('0x' + hash, {from : account, gas : 200000})
    }).then(function(tx_id) {
      alert("bio added to contract");
    }).catch(function(e) {
      alert("error - " + e);
    });
  });
}

export const updateName = (account) => {
  return appContracts.Citadel.deployed()
    .then((instance) => instance.getName(account))
    .then((data) => {citadelName : data});
};

export const submitNameChange = (name, account) => {
  return appContracts.Citadel.deployed()
    .then((instance) => instance.setName.sendTransaction(name, {from : account})).then(function(tx_id) {
      return tx_id;
    }).catch(function(e) {
      alert("error - " + e);
    })
};

export const submitBuy = (eth, account, tokenOwnerAccount) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => {
      return instance.buy.sendTransaction({
        from : account,
        to : tokenOwnerAccount, 
        value : eth
      });
    });
};