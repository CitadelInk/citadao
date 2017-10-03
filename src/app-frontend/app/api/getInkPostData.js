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
        res({authorgAddress : results[0], submissionHash : results[1], revisionHash : results[2], index : index});
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

export const getAccountInfo = (account, web3) => {
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
              //console.log("RETURN account name. account: " + account);
              res({
                authorg : account,
                bioRevisionHashes : bioRevisions,
                latestRevisionHash : mostRecentBio,
                revisionBio : JSON.parse(data.selectedBioRevision.toString())
              })
            })
          } else {
            res({
              authorg : account,
              bioRevisionHashes : [],
              latestRevisionHash : "1",
              revisionBio : {name : "none", image : null}
            })
          }
        } else {
          res({
            authorg : account,
            bioRevisionHashes : [],
            latestRevisionHash : "1",
            revisionBio : {name : "none", image : null}
          })
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
  //console.log("get revision from swarm. revisionHash: " + revisionHash);
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, revision) => {
      const manifest = JSON.parse(revision)
      web3.bzz.retrieve(manifest.entries[0].hash, (error, rev) => {   
        //console.log("SET revision from swarm. revisionHash: " + revisionHash);  
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
  //console.log("get revision time for revision: " + revisionHash);
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getTimestampForRevision(authorgAddress, submissionHash, revisionHash).then((timestamp) => {
        //console.log("SET revision time for revision: " + revisionHash);
        res({timestamp : timestamp})
      })
    })
  })
}

export const getNumReferences = (authorgAddress, submissionHash, revisionHash) => {
  //console.log("get num references for revision: " + revisionHash);
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      //console.log("SET num references for revision: " + revisionHash);
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
        res({refAuthAdd : refKey[0], refSubHash : refKey[1], refRevHash : refKey[2]})
      })
    })
  })
}

