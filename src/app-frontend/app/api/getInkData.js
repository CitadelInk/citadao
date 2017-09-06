import appContracts from 'app-contracts';

export const getInkPublicData = () => {
  return appContracts.Ink.deployed()
    .then((instance) => {
      return Promise.all([
          instance.ink_comptroller(),
          instance.wallet_address()
      ]).then(([ink_comptroller, wallet_address]) => {
        return {
          inkAddress: instance.address,
          inkComptrollerAccount: ink_comptroller,
          inkWalletAddress: wallet_address
        };
      });
    });
};


