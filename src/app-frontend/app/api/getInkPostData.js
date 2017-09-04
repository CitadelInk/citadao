import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

// do this differently once we have cache/infinite scrolling
export const getTotalPostCount = () => {
  return new Promise((res, rej) =>{
    console.log("get total post count");
    appContracts.Ink.deployed()
    .then((instance) => {
      instance.getTotalAuthSubRevKeyCount().then((count) => {
        console.log("count: " + count);
        res({totalPostCount : count});
      });
    });
  });
}

export const getPostKey = (index) => {
  console.log("getPostKey");
  return new Promise((res,rej) => {
    appContracts.Ink.deployed().then((instance) => {
      console.log("instance found")
      instance.getAuthSubRevKey(index).then((results) => {
        console.log("results")
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

export const getAccountName = (account) => {
  console.log("getAccountName")
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
            getAccountBioRevision(mostRecentBio)
            .then((data) => {
              console.log("result")
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

export const getReactionValue = (reactionHash) => {
  return new Promise((res, rej) => {
    const bzzAddress = reactionHash.substring(2);
    localWeb3.bzz.retrieve(bzzAddress, (error, reactionManifest) => {
      // prolly want to handle errors
      const jsonBio = JSON.parse(reactionManifest)
      localWeb3.bzz.retrieve(jsonBio.entries[0].hash, (error, reaction) => {
        res({
          reactionHash: reactionHash, reactionValue: reaction
        });
      });
    });
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

// once we add revisioning, will need to get specific revision (default likely most recent?)
export const getRevisionFromSwarm = (revisionHash) => {
  return new Promise((res, rej) => {
    const bzzAddress = revisionHash.substring(2);
    localWeb3.bzz.retrieve(bzzAddress, (error, revision) => {
      const manifest = JSON.parse(revision)
      localWeb3.bzz.retrieve(manifest.entries[0].hash, (error, rev) => {     
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

export const getRevisionReactions = (revisionHash, authorgHash, reactions) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      var revisionReactionReactorPromisess = reactions.map(reaction => {
        return instance.getReactorsForAuthorgRevisionReaction(authorgHash, revisionHash, reaction.reactionHash).then((reactors) => {
          return {reactionHash : reaction.reactionHash, reactionValue : reaction.reactionValue, reactionReactors : reactors};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        res ({
          revisionReactionReactors: revisionReactionReactors
        })
      })
    })
  });
}

export const getRevisionSectionResponses = (revisionHash, sectionIndex) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getReferencesForRevisionSection(revisionHash, sectionIndex).then((result) => {
        console.log("result: " + result);
        res ({responses : result})
      })
    })
  })
}

export const getRevisionTime = (authorgAddress, submissionHash, revisionHash) => {
  return new Promise((res, rej) => {
    appContracts.Ink.deployed().then((instance) => {
      instance.getTimestampForRevision(authorgAddress, submissionHash, revisionHash).then((timestamp) => {
        console.log("timestamp result: " + timestamp)
        res({timestamp : timestamp})
      })
    })
  })
}
