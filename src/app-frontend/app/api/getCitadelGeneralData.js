import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'

export const getApprovedReactions = () => {
  return new Promise((res, rej) =>{
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getApprovedReactions()
      ])
      .then(([approvedReactionHashes]) => {
        getReactionValues(approvedReactionHashes).then((approvedReactions) => {
          res({approvedReactions : approvedReactions.reactions});
        })
      })
    });
  });
}

export const getReactionValues = (approvedReactionHashes) => {
  return new Promise((res, rej) => {
    var promises = approvedReactionHashes.map(hash => {
      return getReactionValue(hash)
    })
    Promise.all(promises).then(values => {
      var reactions = values.map(result => {
        return {reactionHash : result.reactionHash, reactionValue : result.reactionValue};
      })
      res({reactions : reactions});
    })
  })  
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