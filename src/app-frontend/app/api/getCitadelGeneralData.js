import appContracts from 'app-contracts'

export const getApprovedReactions = (web3) => {
  var t0 = performance.now();
  return new Promise((res, rej) =>{
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getApprovedReactions()
      ])
      .then(([approvedReactionHashes]) => {
        getReactionValues(approvedReactionHashes, web3).then((approvedReactions) => {
          var t1 = performance.now();
          console.debug("getApprovedReactions took " + (t1 - t0) + " milliseconds.")
          res({approvedReactions : approvedReactions.reactions});
        })
      })
    });
  });
}

export const getApprovedAuthorgReactions = (web3) => {
  var t0 = performance.now();
  return new Promise((res, rej) =>{
    appContracts.Citadel.deployed()
    .then((instance) => {
      Promise.all([
        instance.getApprovedAuthorgReactions()
      ])
      .then(([approvedReactionHashes]) => {
        getReactionValues(approvedReactionHashes, web3).then((approvedReactions) => { 
          var t1 = performance.now();
          console.debug("getApprovedAuthorgReactions took " + (t1 - t0) + " milliseconds.")
          res({approvedAuthorgReactions : approvedReactions.reactions});
        })
      })
    });
  });
}

export const getReactionValues = (approvedReactionHashes, web3) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    var promises = approvedReactionHashes.map(hash => {
      return getReactionValue(hash, web3)
    })
    Promise.all(promises).then(values => {
      var reactions = new Map();
      values.map(result => {
        reactions.set(result.reactionHash, result.reactionValue);
      })
      var t1 = performance.now();
      console.debug("getReactionValues took " + (t1 - t0) + " milliseconds.")
      res({reactions : reactions});
    })
  })  
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
        console.debug("getReactionValue took " + (t1 - t0) + " milliseconds.")
        res({
          reactionHash: reactionHash, reactionValue: reaction
        });
      });
    });
  });
}