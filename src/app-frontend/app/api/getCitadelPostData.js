import appContracts from 'app-contracts'


export const getRevisionReactions = (authorgAddress, revisionHash, submissionHash, reactions) => {
  var t0 = performance.now();
  var keys =  Array.from(reactions.keys());
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = keys.map(function(entry) {
        return instance.getReactorsForAuthorgRevisionReaction(authorgAddress, revisionHash, submissionHash, entry).then((result) => {
          return {reactionHash : entry, reactionReactors : result[0], reactionReactorsTimestamps : result[1]};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        var totalReactions = 0;
        revisionReactionReactors.map((result) => {
          totalReactions += result.reactionReactors.length;
        })
        var t1 = performance.now();
        console.debug("getRevisionReactions took " + (t1 - t0) + " milliseconds.")
        res ({
          revisionReactionReactors: revisionReactionReactors,
          reactionCount : totalReactions
        })
      })
    })
  });
}


export const getAuthorgBioReactions = (authorgAddress, bioRevisionHash, reactions) => {
  var t0 = performance.now();
  var keys =  Array.from(reactions.keys());
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = keys.map(function(entry) {
        return instance.getReactorsForAuthorgBio(authorgAddress, bioRevisionHash, entry).then((result) => {
          return {reactionHash : entry, reactionReactors : result[0], reactionReactorsTimestamps : result[1]};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        var totalReactions = 0;
        revisionReactionReactors.map((result) => {
          totalReactions += result.reactionReactors.length;
        })
        var t1 = performance.now();
        console.debug("getAuthorgBioReactions took " + (t1 - t0) + " milliseconds.")
        res ({
          revisionReactionReactors: revisionReactionReactors,
          reactionCount : totalReactions
        })
      })
    })
  });
}

export const getFollowers = (authorgAddress) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      instance.getFollowers(authorgAddress).then((followers) => {
        var t1 = performance.now();
        console.debug("getFollowers took " + (t1 - t0) + " milliseconds.")
        res ({followers});
      })
    })
  })
}

export const getAuthorgsFollowing = (authorgAddress) => {
  var t0 = performance.now();
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      instance.getFollowedUsers(authorgAddress).then((authorgsFollowing) => {
        var t1 = performance.now();
        console.debug("getAuthorgsFollowing took " + (t1 - t0) + " milliseconds.")
        res ({authorgsFollowing});
      })
    })
  })
}