import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

export const getEthBalance = (account) => localWeb3.fromWei(localWeb3.eth.getBalance(account), 'ether').toString();

// could be cleaned

export const getAccounts = () => {
  return new Promise((res, rej) => {
    localWeb3.eth.getAccounts((error, accounts) => {
      if (error) {
        rej(error);
      } else if (accounts) {
        res({accounts})
      }
    });
  });
}

export const getAccountBioRevisions = (account) => {
  return new Promise((res, rej) => {
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

export const getAccountName = (account) => {
   return new Promise((res, rej) => {
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)]
      )      
      .then(([bioRevisions]) => {
        if(bioRevisions !== null) {
          if (bioRevisions.length > 0) {
            const mostRecentBio = bioRevisions[bioRevisions.length - 1];
            getAccountBioRevision(mostRecentBio)
            .then((data) => {
              res({
                accountName : JSON.parse(data.selectedBioRevision.toString()).name
              })
            })
          } else {
            res({accountName : "none"})
          }
        } else {
          res({accountName : "none"})
        }
      })
    })
  });
}

export const getAccountBioRevision = (revisionHash) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    localWeb3.bzz.retrieve(bzzAddress, (error, bio) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(bio)
      localWeb3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
        res({
          selectedBioRevision: bioText
        });
      });
    });
  });
}
