pragma solidity ^0.4.13;

contract Citadel {

    event ReactionRecorded(address indexed _postAuthorg, bytes32 indexed _postSubmission, bytes32 indexed _postRevision);

    function Citadel() {
    }

    // citadel has some follower stuff
    mapping(address => address[]) public authorgToFollowing; 
    mapping(address => address[]) public authorgToFollowers;

    function follow(address authorgToFollow) {
        authorgToFollowing[msg.sender].push(authorgToFollow);
        authorgToFollowers[authorgToFollow].push(msg.sender);
    }

    // and some reaction stuff  
    struct InkAuthorgExtension {
        mapping(bytes32 => InkSubmissionExtension) submissions;
    } 

    struct InkSubmissionExtension {
        mapping(bytes32 => InkRevisionExtension) revisions;
    }

    struct InkRevisionExtension {
        mapping(bytes32 => Reactor[]) reactionToReactors;
    }           

    struct Reactor {
        address reactingAuthorg;
        uint reactionTimestamp;
    }

    mapping(address => InkAuthorgExtension) authorgExtensionMap;
    bytes32[] public approved_reactions;
    mapping(bytes32 => bool) reaction_approved;
    
    function getApprovedReactions() constant returns (bytes32[] hashes) {
        return approved_reactions;
    }

    function addApprovedReaction(bytes32 reaction) {
        reaction_approved[reaction] = true;
        approved_reactions.push(reaction);
    }

    function getReactionForAuthorgSubmissionRevision(address authorg, bytes32 submission, bytes32 revision, bytes32 reaction, uint index) constant returns (address, uint) {
        if (reaction_approved[reaction]/* && isAuthorgOfRevision(authorg, revision)*/) {
            var reactor = authorgExtensionMap[authorg].submissions[submission].revisions[revision].reactionToReactors[reaction][index];
            return (reactor.reactingAuthorg, reactor.reactionTimestamp);
        } else {
            return (address(0), 0);
        }
    }

    function getReactorsForAuthorgRevisionReaction(address authorg, bytes32 submission, bytes32 revision, bytes32 reaction) constant returns (uint) {
        if (reaction_approved[reaction]/* && isAuthorgOfRevision(authorg, revision)*/) {
            return authorgExtensionMap[authorg].submissions[submission].revisions[revision].reactionToReactors[reaction].length;
        } else {
            return 0;
        }
    }
    
    function submitReaction(address authorgAddress, bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash, bytes32 reaction) {
        //spend(reaction_cost_in_ink);
        if (reaction_approved[reaction]) {
            InkRevisionExtension rev = authorgExtensionMap[authorgAddress].submissions[subCitadelManifestHash].revisions[revCitadelManifestHash];
            rev.reactionToReactors[reaction].push(
                Reactor({
                    reactingAuthorg : msg.sender, 
                    reactionTimestamp : block.timestamp
                }));           

            ReactionRecorded(authorgAddress, subCitadelManifestHash, revCitadelManifestHash); 
        }
    }
}