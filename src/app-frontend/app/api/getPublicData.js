import appContracts from 'app-contracts';
import localWeb3 from "../helpers/web3Helper";

export const getAdvancedTokenPublicData = () => {
  return appContracts.MyAdvancedToken.deployed()
    .then((data) => {
      return {
        buyPrice: parseFloat(data.buyPrice().toString()),
        tokenSupply: parseInt(data.tokenSupply().toString()),
        tokenOwnerAccount: data.owner(),
        tokenAddress: data.address,
      };
    });
};


export const getCitadelPublicData = () => {
  return appContracts.Citadel.deployed()
    .then((instance) => {
      return {
        citadelAddress: instance.address,
        nameChangeCostInCita: instance.cost_name_update_in_cita(),
        citadelComptrollerAccount: instance.citadel_comptroller(),
        CitadelWalletAddress: instance.wallet_address()
      };
    });
};

