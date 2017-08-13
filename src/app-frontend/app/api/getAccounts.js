import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

const getEthBalance = account => localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString();

// could be cleaned

export const getAccounts = (accountIndex, selectedBioRevisionIndex) => {
  return new Promise((res, rej) => {
    localWeb3.eth.getAccounts((error, accounts) => {
      if (error) {
        rej(error);
      } else if (accounts) {
        const account = accounts[accountIndex];
        localWeb3.eth.defaultAccount = account;

        appContracts.Citadel.deployed()
        .then((instance) => {
          Promise.all([
            instance.getName(account),
            instance.getBioRevisions(account)
          ]).then(([citadelName, bioRevisions]) => {
            const hash = bioRevisions[selectedBioRevisionIndex];
            if (hash) {
              const bzzAddress = hash.substring(2);
              console.log("1 state set - data[selectedBioRevisionIndex]=" + hash)
              localWeb3.bzz.retrieve(bzzAddress, (error, bio) => {
                // prolly want to handle errors
                console.log('bio - ' + bio)
                const jsonBio = JSON.parse(bio)
                console.log('jsonBio entries - ' + jsonBio.entries[0].hash)     
                localWeb3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
                  console.log('bio text = ' + bioText)
                  res({
                    selectedBioRevision: bioText,
                    bioRevisions,
                    citadelName,
                    ethBalance: getEthBalance(account),
                    account
                  });
                });
              }); 
            } else {
              res({
                citadelName,
                bioRevisions,
                ethBalance: getEthBalance(account),
                account
              });
            }
          });
        });
      }
    });
  });
};
