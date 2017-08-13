import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

const getEthBalance = account => localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString();

// could be cleaned

export const getAccounts = () => {
  return new Promise((res, rej) => {
    console.log("promise 1")
    localWeb3.eth.getAccounts((error, accounts) => {
      console.log("promise accounts = " + accounts.length)
      if (error) {
        console.log(error)
        rej(error);
      } else if (accounts) {
        res({accounts})
      }
    });
  });
}

export const getAccountBioRevisions = (account) => {
  return new Promise((res, rej) => {
    
    //const account = accounts[accountIndex];
    //localWeb3.eth.defaultAccount = account;

    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)
      ])
      .then(([bioRevisions]) => {
        res({bioRevisions: bioRevisions})
      })
    });
  });
}

export const getAccountBioRevision = (revisionHash) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    //console.log("1 state set - data[selectedBioRevisionIndex]=" + hash)
    localWeb3.bzz.retrieve(bzzAddress, (error, bio) => {
      // prolly want to handle errors
      console.log('bio - ' + bio)
      const jsonBio = JSON.parse(bio)
      console.log('jsonBio entries - ' + jsonBio.entries[0].hash)     
      localWeb3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
        console.log('bio text = ' + bioText)
        res({
          selectedBioRevision: bioText
        });
      });
    });
  });
}

export const getAccountBioData = (account, selectedBioRevisionIndex) => {
  return new Promise((res, rej) => {
    
    //const account = accounts[accountIndex];
    //localWeb3.eth.defaultAccount = account;

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
                ethBalance: getEthBalance(account)
              });
            });
          }); 
        } else {
          res({
            citadelName,
            bioRevisions,
            ethBalance: getEthBalance(account)
          });
        }
      });
    });
  });
};
