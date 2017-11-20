import appContracts from 'app-contracts';

export const getInkPublicData = () => {
  return appContracts.Ink.deployed()
    .then((instance) => {
      return Promise.all([
          instance.getComptroller()
      ]).then(([ink_comptroller]) => {
        return {
          inkAddress: instance.address,
          inkComptrollerAccount: ink_comptroller
        };
      });
    });
};



