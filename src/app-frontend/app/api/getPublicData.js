import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const getAdvancedTokenPublicData = () => {
  return appContracts.MyAdvancedToken.deployed()
    .then((data) => {
      return Promise.all([
          data.buyPrice(),
          data.totalSupply(),
          data.owner()
      ]).then(([buyPrice, totalSupply, owner]) => {
        return {
          buyPrice: parseFloat(buyPrice.toString()),
          tokenSupply: parseInt(totalSupply.toString()),
          tokenOwnerAccount: owner,
          tokenAddress: data.address,
        };
      });
    });
};


export const getCitadelPublicData = () => {
  return appContracts.Citadel.deployed()
    .then((instance) => {
      return Promise.all([
          instance.cost_name_update_in_cita(),
          instance.citadel_comptroller(),
          instance.wallet_address()
      ]).then(([cost_name_update_in_cita, citadel_comptroller, wallet_address]) => {
        return {
          citadelAddress: instance.address,
          citadelComptrollerAccount: citadel_comptroller,
          citadelWalletAddress: wallet_address
        };
      });
    });
};

export const getCitaBalance = (account) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance)
    .then((data) => data.balanceOf(account))
    .then((p) => parseInt(p.toString()));
};



