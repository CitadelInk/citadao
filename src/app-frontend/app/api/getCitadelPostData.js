import appContracts from 'app-contracts'


export const getRevisionReactions = (authorgAddress, revisionHash, submissionHash, reactions) => {
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
        //console.log("total reactions: " + totalReactions);
        res ({
          revisionReactionReactors: revisionReactionReactors,
          reactionCount : totalReactions
        })
      })
    })
  });
}


export const getAuthorgBioReactions = (authorgAddress, bioRevisionHash, reactions) => {
  var keys =  Array.from(reactions.keys());
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = keys.map(function(entry) {
        console.log("check a bio reaction");
        return instance.getReactorsForAuthorgBio(authorgAddress, bioRevisionHash, entry).then((result) => {
          return {reactionHash : entry, reactionReactors : result[0], reactionReactorsTimestamps : result[1]};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        var totalReactions = 0;
        revisionReactionReactors.map((result) => {
          totalReactions += result.reactionReactors.length;
        })
        console.log("total bio reactions: " + totalReactions);
        res ({
          revisionReactionReactors: revisionReactionReactors,
          reactionCount : totalReactions
        })
      })
    })
  });
}

export const getFollowers = (authorgAddress) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      instance.getFollowers(authorgAddress).then((followers) => {
        res ({followers});
      })
    })
  })
}

export const getAuthorgsFollowing = (authorgAddress) => {
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      instance.getFollowedUsers(authorgAddress).then((authorgsFollowing) => {
        res ({authorgsFollowing});
      })
    })
  })
}