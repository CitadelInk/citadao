import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const getAdvancedTokenPublicData = () => {
  return appContracts.MyAdvancedToken.deployed()
    .then((data) => {
      return Promise.all([
          data.buyPrice(),
          data.totalSupply(),
          data.owner(),
          data.inkComptroller()
      ]).then(([buyPrice, totalSupply, owner, comptroller]) => {
        return {
          citaBuyPrice: parseFloat(buyPrice.toString()),
          tokenSupply: parseInt(totalSupply.toString()),
          tokenOwnerAccount: owner,
          tokenAddress: data.address,
          tokenInkComptroller: comptroller
        };
      });
    });
};

export const getInkBalance = (account) => {
  return appContracts.MyAdvancedToken.deployed()
    .then((instance) => instance)
    .then((data) => data.balanceOf(account))
    .then((p) => parseInt(p.toString()));
};



