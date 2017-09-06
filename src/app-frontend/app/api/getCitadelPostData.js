import appContracts from 'app-contracts'


export const getRevisionReactions = (authorgAddress, revisionHash, submissionHash, reactions) => {
  var keys =  Array.from(reactions.keys());
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = keys.map(function(entry) {
        return instance.getReactorsForAuthorgRevisionReaction(authorgAddress, revisionHash, submissionHash, entry).then((reactors) => {
          return {reactionHash : entry, reactionReactors : reactors};
        })
      })
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        var totalReactions = 0;
        revisionReactionReactors.map((result) => {
          totalReactions += parseInt(result.reactionReactors);
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

