pragma solidity ^0.4.13;

contract AbstractWallet {
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}

contract Managed {
    address public citadel_comptroller;
    modifier onlyComptroller {
        require(msg.sender == citadel_comptroller);
        _;
    }
}

contract Citadel is Managed {

    event BioUpdated(address indexed _from, bytes32 _value);

    address public wallet_address;
    uint256 public cost_name_update_in_cita;
    uint256 public reaction_cost_in_cita;
    uint256 public revision_cost_in_cita; 
    
    function Citadel(address wallet, uint256 reactionCost, uint256 revisionCost) {
        citadel_comptroller = msg.sender;
        wallet_address = wallet;
        reaction_cost_in_cita = reactionCost;
        revision_cost_in_cita = revisionCost;
    }
    
    struct Authorg {
        Submission selfBioSubmission;
        
        mapping(bytes32 => Submission) submissions;
        bytes32[] allAuthorgSubmissionHashes;
    }
    
    struct Submission {
        bytes32 submissionCitadelManifestHash;
        mapping(bytes32 => Revision) submissionRevisionMap;
        bytes32[] submissionRevisionHashes;
    }
    
    struct Revision {
        bytes32 citadelManifestHash;
        bytes32[] responseManifestHashes;
        mapping(bytes32 => Reactor) reactionToReactorsMap;
    }

    struct Reactor {
        address[] reactors;
    }
    
    mapping(address => Authorg) internalAuthorgs;
    mapping(bytes32 => address) public submissionToAuthorg; // hack - remove this
    bytes32[] public allSubmissions;
    bytes32[] public approved_reactions;
    mapping(bytes32 => bool) reaction_approved;
    
    function spend(uint256 value) private {
        AbstractWallet(wallet_address).transferFrom(msg.sender, wallet_address, value);
    }
    
    function setWalletAddress(address newWalletAddress) onlyComptroller {
        wallet_address = newWalletAddress;
    }

    function addApprovedReaction(bytes32 reaction) onlyComptroller {
        reaction_approved[reaction] = true;
        approved_reactions.push(reaction);
    }

    function getBioRevisions(address authorgAddress) constant returns (bytes32[] hashes) {
        return internalAuthorgs[authorgAddress].selfBioSubmission.submissionRevisionHashes;
    }

    function getAllSubmissions() constant returns (bytes32[] hashes) {
        return allSubmissions;
    }

    function getApprovedReactions() constant returns (bytes32[] hashes) {
        return approved_reactions;
    }

    function getReactorsForAuthorgSubmissionRevisionReaction(address authorg, bytes32 submission, bytes32 revision, bytes32 reaction) constant returns (address[]) {
        if (reaction_approved[reaction] && isAuthorgOfSubmissionRevision(authorg, submission, revision)) {
            return internalAuthorgs[authorg].submissions[submission].submissionRevisionMap[revision].reactionToReactorsMap[reaction].reactors;
        } else {
            return new address[](0);
        }
    }   
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        spend(5);
        var newResponseArray = new bytes32[](0);
        internalAuthorgs[msg.sender].selfBioSubmission.submissionRevisionHashes.push(citadelManifestHash);
        var revision = Revision({
            citadelManifestHash : citadelManifestHash,
            responseManifestHashes : newResponseArray
        });
        internalAuthorgs[msg.sender].selfBioSubmission.submissionRevisionMap[citadelManifestHash] = revision;
        BioUpdated(msg.sender, citadelManifestHash);
    }
    
    function isAuthorgOfSubmission(address authorgAddress, bytes32 submissionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.submissionRevisionHashes.length != 0;
    }
    
    function isAuthorgOfBio(address authorgAddress, bytes32 bioRevisionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        authorg.selfBioSubmission.submissionRevisionMap[bioRevisionHash].citadelManifestHash != 0;
    }
    
    function isAuthorgOfSubmissionRevision(address authorgAddress, bytes32 submissionHash, bytes32 revisionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.submissionRevisionMap[revisionHash].citadelManifestHash != 0;
    }
    
    function submitRevision(bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash) {
        spend(5);
        submitRevision(msg.sender, subCitadelManifestHash, revCitadelManifestHash);
    }
    
    function submitRevision(address senderAddr, bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash) private {
        internalAuthorgs[senderAddr].allAuthorgSubmissionHashes.push(subCitadelManifestHash);
        var newResponseArray = new bytes32[](0);
        var revisionArray = internalAuthorgs[msg.sender].submissions[subCitadelManifestHash].submissionRevisionHashes;
        revisionArray.push(revCitadelManifestHash);
        var revision = Revision({
            citadelManifestHash : revCitadelManifestHash,
            responseManifestHashes : newResponseArray
        });
        internalAuthorgs[msg.sender].submissions[subCitadelManifestHash].submissionRevisionMap[revCitadelManifestHash] = revision;
        internalAuthorgs[msg.sender].submissions[subCitadelManifestHash].submissionCitadelManifestHash = subCitadelManifestHash;
        submissionToAuthorg[subCitadelManifestHash] = msg.sender;        
        allSubmissions.push(subCitadelManifestHash);
    }

    function submitReaction(address authorgAddress, bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash, bytes32 reaction) {
        spend(1);
        if (reaction_approved[reaction]) {
            Revision rev = internalAuthorgs[authorgAddress].submissions[subCitadelManifestHash].submissionRevisionMap[revCitadelManifestHash];
            if (rev.citadelManifestHash == revCitadelManifestHash) {
                rev.reactionToReactorsMap[reaction].reactors.push(msg.sender);
            }
        }
    }
    
    function respondToBio(address originalAuthorgAddress, bytes32 originalSubmissionRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        if (isAuthorgOfBio(originalAuthorgAddress, originalSubmissionRevisionHash)) {
            spend(5);
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            internalAuthorgs[originalAuthorgAddress].selfBioSubmission.submissionRevisionMap[originalSubmissionRevisionHash].responseManifestHashes.push(responseSubmissionHash);
        }
    }
    
    function respondToSubmission(address originalAuthorgAddress, bytes32 originalSubmissionHash, bytes32 originalSubmissionRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        if (isAuthorgOfSubmissionRevision(originalAuthorgAddress, originalSubmissionHash, originalSubmissionRevisionHash)) {
            spend(5);
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            var authorg = internalAuthorgs[originalAuthorgAddress];
            var submission = authorg.submissions[originalSubmissionHash];
            var revision = submission.submissionRevisionMap[originalSubmissionRevisionHash];
            revision.responseManifestHashes.push(responseRevisionHash);
        }
    }
}