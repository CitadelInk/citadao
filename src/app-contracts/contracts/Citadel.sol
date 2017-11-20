pragma solidity ^0.4.13;

contract Citadel {

    event ReactionRecorded(address indexed _postAuthorg, uint indexed _postSubmission, bytes32 indexed _postRevision);
    event AuthorgReactionRecorded(address indexed _authorg);
    event AuthorgFollowed(address indexed _followedAuthorg, address indexed _follower);

    function Citadel() {
    }

    // citadel has some follower stuff
    mapping(address => address[]) public authorgToFollowing; 
    mapping(address => address[]) public authorgToFollowers;

    function follow(address authorgToFollow) {
        authorgToFollowing[msg.sender].push(authorgToFollow);
        authorgToFollowers[authorgToFollow].push(msg.sender);
        AuthorgFollowed(authorgToFollow, msg.sender);
    }

    // and some reaction stuff  
    struct InkAuthorgExtension {
        mapping(uint => InkSubmissionExtension) submissions;
        mapping(bytes32 => InkBioRevisionExtension) bioRevisions;
    } 

    struct InkBioRevisionExtension {
        mapping(bytes32 => mapping(address => bool)) hasReactorReacted;
        mapping(bytes32 => address[]) reactionToReactors;
        mapping(bytes32 => uint[]) reactionToReactorsTimestamps;
    }

    struct InkSubmissionExtension {
        mapping(bytes32 => InkRevisionExtension) revisions;
    }

    struct InkRevisionExtension {
        mapping(bytes32 => mapping(address => bool)) hasReactorReacted;
        mapping(bytes32 => address[]) reactionToReactors;
        mapping(bytes32 => uint[]) reactionToReactorsTimestamps;
    }           

    mapping(address => InkAuthorgExtension) authorgExtensionMap;
    bytes32[] public approved_reactions;
    mapping(bytes32 => bool) reaction_approved;
    bytes32[] public approved_authorg_reactions;
    mapping(bytes32 => bool) authorg_reaction_approved;
    
    function getApprovedReactions() constant returns (bytes32[] hashes) {
        return approved_reactions;
    }

    function getApprovedAuthorgReactions() constant returns (bytes32[] hashes) {
        return approved_authorg_reactions;
    }

    function addApprovedReaction(bytes32 reaction) {
        reaction_approved[reaction] = true;
        approved_reactions.push(reaction);
    }

    function addApprovedAuthorgReaction(bytes32 reaction) {
        authorg_reaction_approved[reaction] = true;
        approved_authorg_reactions.push(reaction);
    }

    function getFollowedUsers(address authorg) constant returns (address[] followedUsers) {
        return authorgToFollowing[authorg];
    }

    function getFollowers(address authorg) constant returns (address[] followers) {
        return authorgToFollowers[authorg];
    }
     

    function getReactorsForAuthorgRevisionReaction(address authorg, uint submission, bytes32 revision, bytes32 reaction) constant returns (address[], uint[]) {
        if (reaction_approved[reaction]) {
            return (authorgExtensionMap[authorg].submissions[submission].revisions[revision].reactionToReactors[reaction],
                    authorgExtensionMap[authorg].submissions[submission].revisions[revision].reactionToReactorsTimestamps[reaction]
            );
        } else {
            return (new address[](0), new uint[](0));
        }
    }

    function getReactorsCountForAuthorgRevisionReaction(address authorg, uint submission, bytes32 revision, bytes32 reaction) constant returns (uint) {
        if (reaction_approved[reaction]) {
            return authorgExtensionMap[authorg].submissions[submission].revisions[revision].reactionToReactors[reaction].length;
        } else {
            return 0;
        }
    }    
    
    function submitReaction(address authorgAddress, uint subCitadelManifestHash, bytes32 revCitadelManifestHash, bytes32 reaction) {
        require(reaction_approved[reaction]);
        InkRevisionExtension rev = authorgExtensionMap[authorgAddress].submissions[subCitadelManifestHash].revisions[revCitadelManifestHash];
        
        require(!rev.hasReactorReacted[reaction][msg.sender]);
        
        
        rev.reactionToReactors[reaction].push(msg.sender);
        rev.reactionToReactorsTimestamps[reaction].push(block.timestamp);
        rev.hasReactorReacted[reaction][msg.sender] = true;

        ReactionRecorded(authorgAddress, subCitadelManifestHash, revCitadelManifestHash); 
    
    }  

    function getReactorsForAuthorgBio(address authorg, bytes32 bioRevision, bytes32 reaction) constant returns (address[], uint[]) {
        if (authorg_reaction_approved[reaction]) {
            return (authorgExtensionMap[authorg].bioRevisions[bioRevision].reactionToReactors[reaction],
                    authorgExtensionMap[authorg].bioRevisions[bioRevision].reactionToReactorsTimestamps[reaction]
            );
        } else {
            return (new address[](0), new uint[](0));
        }
    }

    function getReactorsCountForAuthorg(address authorg, bytes32 bioRevision, bytes32 reaction) constant returns (uint) {
        if (authorg_reaction_approved[reaction]) {
            return authorgExtensionMap[authorg].bioRevisions[bioRevision].reactionToReactors[reaction].length;
        } else {
            return 0;
        }
    }

    function submitAuthorgReaction(address authorgAddress, bytes32 bioRevision, bytes32 reaction) {
        require(authorg_reaction_approved[reaction]);
        InkAuthorgExtension auth = authorgExtensionMap[authorgAddress];
        
        require(!auth.bioRevisions[bioRevision].hasReactorReacted[reaction][msg.sender]);
        
        auth.bioRevisions[bioRevision].reactionToReactors[reaction].push(msg.sender);
        auth.bioRevisions[bioRevision].reactionToReactorsTimestamps[reaction].push(block.timestamp);

        auth.bioRevisions[bioRevision].hasReactorReacted[reaction][msg.sender] = true;
        AuthorgReactionRecorded(authorgAddress);         
    }
}