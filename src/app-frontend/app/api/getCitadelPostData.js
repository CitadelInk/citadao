import appContracts from 'app-contracts'


export const getRevisionReactions = (authorgAddress, revisionHash, submissionHash, reactions) => {
  console.log("reactions: " + reactions);
  var keys =  Array.from(reactions.keys());
  console.log("keys: " + keys);
  return new Promise((res, rej) => {
    appContracts.Citadel.deployed().then((instance) => {
      var revisionReactionReactorPromisess = keys.map(function(entry) {
        return instance.getReactorsForAuthorgRevisionReaction(authorgAddress, revisionHash, submissionHash, entry).then((reactors) => {
          console.log("within");
          return {reactionHash : entry, reactionReactors : reactors};
        })
      })
      console.log("here we are - promises: " + revisionReactionReactorPromisess);
      Promise.all(revisionReactionReactorPromisess).then((revisionReactionReactors) => {
        var totalReactions = 0;
        console.log("revisionReactionReactors: " + revisionReactionReactors);
        revisionReactionReactors.map((result) => {
          console.log("NEW - reactionHash: " + result.reactionHash);
          console.log("value: " + result.reactionReactors);
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

