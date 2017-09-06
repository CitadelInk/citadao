import appContracts from 'app-contracts'

// do this differently once we have cache/infinite scrolling
export const getTotalPostCount = () => {
  return new Promise((res, rej) =>{
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.getTotalAuthSubRevKeyCount().then((count) => {
        res({totalPostCount : count});
      });
    });
  });
}

export const getPostKey = (index) => {
  return new Promise((res,rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getAuthSubRevKey(index).then((results) => {
        res({authorgAddress : results[0], submissionHash : results[1], revisionHash : results[2]});
      })
    })
  })
}

export const getAccountBioRevisions = (account) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed()
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

export const getAccountName = (account, web3) => {
   return new Promise((res, rej) => {
    appContracts.Ink.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)]
      )      
      .then(([bioRevisions]) => {
        if(bioRevisions !== null) {
          if (bioRevisions.length > 0) {
            const mostRecentBio = bioRevisions[bioRevisions.length - 1];
            getAccountBioRevision(mostRecentBio, web3)
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

export const getReactionValue = (reactionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = reactionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, reactionManifest) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(reactionManifest)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, reaction) => {
        res({
          reactionHash: reactionHash, reactionValue: reaction
        });
      });
    });
  });
}

export const getAccountBioRevision = (revisionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, bio) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(bio)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
        res({
          selectedBioRevision: bioText
        });
      });
    });
  });
}

// once we add revisioning, will need to get specific revision (default likely most recent?)
export const getRevisionFromSwarm = (revisionHash, web3) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, revision) => {
      const manifest = JSON.parse(revision)
      web3.bzz.retrieve(manifest.entries[0].hash, (error, rev) => {     
        var revJson = JSON.parse(rev)
        res ({
          revisionSwarmHash: revisionHash, 
          revisionSwarmAuthorgHash: revJson.authorg, 
          revisionSwarmTitle: revJson.title, 
          revisionSwarmText: revJson.text
        }) 
      })
    })
  })
}

export const getRevisionTime = (authorgAddress, submissionHash, revisionHash) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getTimestampForRevision(authorgAddress, submissionHash, revisionHash).then((timestamp) => {
        res({timestamp : timestamp})
      })
    })
  })
}

export const getNumReferences = (authorgAddress, submissionHash, revisionHash) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getNumberReferencesForAuthorgSubmissionRevision(authorgAddress, submissionHash, revisionHash).then((count) => {
        res({count : count})
      })
    })
  })
}

export const getReferenceKey = (authorgAddress, submissionHash, revisionHash, index) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getReferenceForAuthorgSubmissionRevision(authorgAddress, submissionHash, revisionHash, index).then((refKey) => {
        console.log("refKey: " + refKey);
        console.log("refKey[0]: " + refKey[0]);
        console.log("refKey[1]: " + refKey[1]);
        console.log("refKey[2]: " + refKey[2]);
        res({refAuthAdd : refKey[0], refSubHash : refKey[1], refRevHash : refKey[2]})
      })
    })
  })
}

