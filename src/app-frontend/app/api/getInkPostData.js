import appContracts from 'app-contracts'

// do this differently once we have cache/infinite scrolling
export const getTotalPostCount = () => {
  var t0 = performance.now();
  return new Promise((res, rej) =>{
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.getTotalAuthSubRevKeyCount().then((count) => {
        var t1 = performance.now();
        console.log("getTotalPostCount took " + (t1 - t0) + " milliseconds.")
        res({totalPostCount : count});
      });
    });
  });
}

export const getPostKey = (index) => {
  var t0 = performance.now();
  return new Promise((res,rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getAuthSubRevKey(index).then((results) => {
        var t1 = performance.now();
        console.log("getPostKey took " + (t1 - t0) + " milliseconds.")
        res({authorgAddress : results[0], submissionHash : results[1], revisionHash : results[2], index : index, timestamp : results[3]});
      })
    })
  })
}

export const getAccountPostKeyCount = (account) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.getPostKeyCountForAuthorg(account).then((count) => {
        res({count});
      })
    })
  })
}

export const getAuthorgPostKey = (account, index) => {
  var t0 = performance.now();
  return new Promise((res,rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getAuthorgPostKey(account, index).then((results) => {
        var t1 = performance.now();
        console.log("getAuthorgPostKey took " + (t1 - t0) + " milliseconds.")
        res({authorgAddress : results[0], submissionHash : results[1], revisionHash : results[2], index : index, timestamp : results[3]});
      })
    })
  })
}

export const getAccountInfo = (account, web3, specificRev = undefined) => {
  var t0 = performance.now();
   return new Promise((res, rej) => {
    appContracts.Ink.deployed()
    .then((instance) => {
      Promise.all([
        instance.getBioRevisions(account)]
      )      
      .then(([result]) => {
        var bioRevisions = result[0];
        var timestamps = result[1];
        if(bioRevisions !== null) {
          if (bioRevisions.length > 0) {
            var bioToLoadIndex = bioRevisions.length - 1;
            if (specificRev) {
              bioToLoadIndex = bioRevisions.indexOf(specificRev);
            }
            const bioToLoad = bioRevisions[bioToLoadIndex];
            getAccountBioRevision(bioToLoad, web3)
            .then((data) => {
              var revision = JSON.parse(data.selectedBioRevision.toString());
              var t1 = performance.now();
              console.log("getAccountInfo took " + (t1 - t0) + " milliseconds.")
              res({
                authorg : account,
                bioRevisionHashes : bioRevisions,
                bioRevisionTimestamps : timestamps,
                bioLoadedIndex : bioToLoadIndex,
                revisionBio : revision
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
  var t0 = performance.now();
  return new Promise((res, rej) => {
    const bzzAddress = reactionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, reactionManifest) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(reactionManifest)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, reaction) => {
        var t1 = performance.now();
        console.log("getReactionValue took " + (t1 - t0) + " milliseconds.")
        res({
          reactionHash: reactionHash, reactionValue: reaction
        });
      });
    });
  });
}

export const getAccountBioRevision = (revisionHash, web3) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, bio) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(bio)
      web3.bzz.retrieve(jsonBio.entries[0].hash, (error, bioText) => {
        var t1 = performance.now();
        console.log("getAccountBioRevision took " + (t1 - t0) + " milliseconds.")
        res({
          selectedBioRevision: bioText
        });
      });
    });
  });
}

// once we add revisioning, will need to get specific revision (default likely most recent?)
export const getRevisionFromSwarm = (revisionHash, web3) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    web3.bzz.retrieve(bzzAddress, (error, revision) => {
      const manifest = JSON.parse(revision)
      web3.bzz.retrieve(manifest.entries[0].hash, (error, rev) => {   
        var revJson = JSON.parse(rev)
        var t1 = performance.now();
        console.log("getRevisionFromSwarm took " + (t1 - t0) + " milliseconds.")
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

export const getNumReferences = (authorgAddress, submissionHash, revisionHash) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getNumberReferencesForAuthorgSubmissionRevision(authorgAddress, submissionHash, revisionHash).then((count) => {
        var t1 = performance.now();
        console.log("getNumReferences took " + (t1 - t0) + " milliseconds.")
        res({count : count})
      })
    })
  })
}

export const getReferenceKey = (authorgAddress, submissionHash, revisionHash, index) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getReferenceForAuthorgSubmissionRevision(authorgAddress, submissionHash, revisionHash, index).then((refKey) => {
        var t1 = performance.now();
        console.log("getReferenceKey took " + (t1 - t0) + " milliseconds.")
        res({refAuthAdd : refKey[0], refSubHash : refKey[1], refRevHash : refKey[2], timestamp : refKey[3]})
      })
    })
  })
}

export const getRevisionTime = (authorgAddress, submissionHash, revisionHash) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getTimestampForRevision(authorgAddress, submissionHash, revisionHash).then((timestamp) => {
        var t1 = performance.now();
        console.log("getRevisionTime took " + (t1 - t0) + " milliseconds.")
        res({timestamp : timestamp})
      })
    })
  })
}

export const getSubmissionRevisions = (authorgAddress, submissionHash) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getSubmissionRevisions(authorgAddress, submissionHash).then((revisionHashes) => {
        var t1 = performance.now();
        console.log("getSubmissionRevisions took " + (t1 - t0) + " milliseconds.")
        res({revisionHashes : revisionHashes})
      })
    })
  })
}