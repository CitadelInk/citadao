pragma solidity ^0.4.13;

contract Managed {
    address public ink_comptroller;  
    modifier onlyComptroller {
        require(msg.sender == ink_comptroller);
        _;
    }
}

contract Ink is Managed {

    event BioUpdated(address indexed _authorg, bytes32 indexed _revHash);
    event RevisionPosted(address indexed _authorg, uint indexed _subHash, bytes32 indexed _revHash);

    uint256 public bio_update_in_ink;
    uint256 public reaction_cost_in_ink;
    uint256 public submit_revision_cost_in_ink; 
    uint256 public submit_submission_cost_in_ink; 
    
    function Ink(uint bioCost, uint256 reactionCost, uint256 revisionCost, uint256 submissionCost) {
        ink_comptroller = msg.sender;
        bio_update_in_ink = bioCost;
        reaction_cost_in_ink = reactionCost;
        submit_revision_cost_in_ink = revisionCost;
        submit_submission_cost_in_ink = submissionCost;
    }
    
    struct Authorg {
        uint submissionIndex;
        Submission selfBioSubmission;       
        mapping(uint => Submission) submissions;
        uint[] postKeyIndexes;
    }

    struct Submission {
        mapping(bytes32 => Revision) revisions;
        bytes32[] revisionHashes;
        uint[] revisionTimestamps;
    }
    
    struct Revision {
        uint timestamp;
        bytes32 citadelManifestHash;

        address[] referenceKeyAuthorgs;
        uint[] referenceKeySubmissions;
        bytes32[] referenceKeyRevisions;

        mapping(address => bool) hasUserReferencedRevision;
    }

    struct SubRevKey {
        uint submissionHash;
        bytes32 revisionHash;
    }

    struct AuthSubRevKey {
        address authorgAddress;
        uint submissionHash;
        bytes32 revisionHash;
    }

    
    mapping(address => Authorg) internalAuthorgs;
    
    // solidity compliation seems to cry when we store these types of keys as a struct, 
    // so we're just using multiple parallel arrays everywhere (for now)
    address[] allPostAuthorgs;
    uint[] allPostSubmissions;
    bytes32[] allPostRevisions;

    function getBioRevisions(address authorgAddress) constant returns (bytes32[] hashes, uint[] timestamps) {
        return (internalAuthorgs[authorgAddress].selfBioSubmission.revisionHashes, 
                internalAuthorgs[authorgAddress].selfBioSubmission.revisionTimestamps);
    }

    function getTotalAuthSubRevKeyCount() constant returns (uint) {
        if (allPostAuthorgs.length != allPostSubmissions.length || allPostAuthorgs.length != allPostRevisions.length) {
            return 0;
        } else {
            return allPostAuthorgs.length;
        }
    }

    function getAuthSubRevKey(uint index) constant returns (address, uint, bytes32, uint) {
        var authorg = allPostAuthorgs[index];
        var submission = allPostSubmissions[index];
        var revision = allPostRevisions[index];
        var timestamp = internalAuthorgs[authorg].submissions[submission].revisions[revision].timestamp;
        return (authorg, submission, revision, timestamp);
    }
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        //spend(bio_update_in_ink);
        var newAuthorgs = new address[](0);
        var newSubmissions = new uint[](0);
        var newRevisions = new bytes32[](0);
        internalAuthorgs[msg.sender].selfBioSubmission.revisionHashes.push(citadelManifestHash);
        internalAuthorgs[msg.sender].selfBioSubmission.revisionTimestamps.push(block.timestamp);
        var revision = Revision({
            timestamp : block.timestamp,
            citadelManifestHash : citadelManifestHash,
            referenceKeyAuthorgs : newAuthorgs,
            referenceKeySubmissions : newSubmissions,
            referenceKeyRevisions : newRevisions
        });
        internalAuthorgs[msg.sender].selfBioSubmission.revisions[citadelManifestHash] = revision;
        BioUpdated(msg.sender, citadelManifestHash);
    }
    
    function isAuthorgOfSubmission(address authorgAddress, uint submissionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.revisionHashes.length != 0;
    }
    
    function isAuthorgOfBio(address authorgAddress, 
                            bytes32 bioRevisionHash) 
                            constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        authorg.selfBioSubmission.revisions[bioRevisionHash].citadelManifestHash != 0;
    }
    
    function isAuthorgOfSubmissionRevision(address authorgAddress, 
                                            uint submissionHash, 
                                            bytes32 revisionHash) 
                                            constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.revisions[revisionHash].citadelManifestHash != 0;
    }

    function submitSubmissionWithReferences(bytes32 revCitadelManifestHash, 
                                            address[] refKeyAuthorgs, 
                                            uint[] refKeySubmissions, 
                                            bytes32[] refKeyRevisions) {
        //spend(submit_submission_cost_in_ink);
        var index = internalAuthorgs[msg.sender].submissionIndex;
        internalAuthorgs[msg.sender].submissionIndex++;
        submitRevisionWithReferences(index, revCitadelManifestHash, refKeyAuthorgs, refKeySubmissions, refKeyRevisions);
    }

    function submitRevisionWithReferences(uint subCitadelManifestHash, 
                                            bytes32 revCitadelManifestHash, 
                                            address[] refKeyAuthorgs, 
                                            uint[] refKeySubmissions, 
                                            bytes32[] refKeyRevisions) {

        require(internalAuthorgs[msg.sender].submissionIndex > subCitadelManifestHash); // can't revise a submission that hasn't happened yet

        submitRevision(subCitadelManifestHash, revCitadelManifestHash);
        require(refKeyAuthorgs.length == refKeySubmissions.length);
        require(refKeyAuthorgs.length == refKeyRevisions.length);

        for (uint i = 0; i < refKeyAuthorgs.length; i++) {
            respondToAuthorgSubmissionRevision(refKeyAuthorgs[i], refKeySubmissions[i], refKeyRevisions[i], subCitadelManifestHash, revCitadelManifestHash);
        }
    }
    
    function submitRevision(uint subCitadelManifestHash, bytes32 revCitadelManifestHash) private {
        //spend(submit_revision_cost_in_ink);
        submitRevision(msg.sender, subCitadelManifestHash, revCitadelManifestHash);
    }
    
    function submitRevision(address sender, uint subCitadelManifestHash, bytes32 revCitadelManifestHash) private {
        Authorg authorg = internalAuthorgs[sender];

        // must have a bio set.
        //require (authorg.selfBioSubmission.revisionHashes.length > 0);

        // never submitted revision to this submission before        
        require (authorg.submissions[subCitadelManifestHash].revisions[revCitadelManifestHash].citadelManifestHash == 0);
        
        var newAuthorgs = new address[](0);
        var newSubmissions = new uint[](0);
        var newRevisions = new bytes32[](0);
        var revision = Revision({
            timestamp : block.timestamp,
            citadelManifestHash : revCitadelManifestHash,
            referenceKeyAuthorgs : newAuthorgs,
            referenceKeySubmissions : newSubmissions,
            referenceKeyRevisions : newRevisions
        });
        authorg.submissions[subCitadelManifestHash].revisions[revCitadelManifestHash] = revision;
        

        authorg.submissions[subCitadelManifestHash].revisionHashes.push(revCitadelManifestHash);
        internalAuthorgs[sender].postKeyIndexes.push(allPostRevisions.length);
        allPostAuthorgs.push(sender);
        allPostSubmissions.push(subCitadelManifestHash);
        allPostRevisions.push(revCitadelManifestHash);
        RevisionPosted(sender, subCitadelManifestHash, revCitadelManifestHash);
    }
    
    function respondToAuthorgSubmissionRevision(address originalAuthorgAddress, 
                                                uint originalSubmissionHash, 
                                                bytes32 originalRevisionHash, 
                                                uint responseSubmissionHash, 
                                                bytes32 responseRevisionHash) {
        require (isAuthorgOfSubmissionRevision(msg.sender, responseSubmissionHash, responseRevisionHash));
        //spend(1);
        var originalAuthorg = internalAuthorgs[originalAuthorgAddress];
        var originalSubmission = originalAuthorg.submissions[originalSubmissionHash];
        var originalRevision = originalSubmission.revisions[originalRevisionHash];

        originalRevision.referenceKeyAuthorgs.push(msg.sender);
        originalRevision.referenceKeySubmissions.push(responseSubmissionHash);
        originalRevision.referenceKeyRevisions.push(responseRevisionHash);

        originalRevision.hasUserReferencedRevision[msg.sender] = true;
    }

    function getNumberReferencesForAuthorgSubmissionRevision(address authorgAddress, 
                                                                uint submissionHash, 
                                                                bytes32 revisionHash) constant returns (uint) 
    {
        return internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash].referenceKeyRevisions.length;
    }

    function getReferenceForAuthorgSubmissionRevision(address authorgAddress, 
                                                        uint submissionHash, 
                                                        bytes32 revisionHash, 
                                                        uint index) constant returns(address, uint, bytes32, uint) {
        Revision rev = internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash];
        address refAuthorgAddress = rev.referenceKeyAuthorgs[index];
        uint refSubmissionHash = rev.referenceKeySubmissions[index];
        bytes32 refRevisionHash = rev.referenceKeyRevisions[index];
        Revision refRevision = internalAuthorgs[refAuthorgAddress].submissions[refSubmissionHash].revisions[refRevisionHash];
        return (refAuthorgAddress, refSubmissionHash, refRevisionHash, refRevision.timestamp);
    }

    function getPostKeyCountForAuthorg(address authorgAddress) constant returns (uint) {
        return internalAuthorgs[authorgAddress].postKeyIndexes.length;
    }

    function getAuthorgPostKey(address authAdd, uint indexIndex) constant returns (address authorgAddress, uint submissionHash, bytes32 revisionHash, uint timestamp) {
        uint index = internalAuthorgs[authAdd].postKeyIndexes[indexIndex];
        return (getAuthSubRevKey(index));
    }

    function getTimestampForRevision(address authorgAddress, uint submissionHash, bytes32 revisionHash) constant returns(uint) {
        return internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash].timestamp;
    }

    function getSubmissionRevisions(address authorgAddress, uint submissionHash) constant returns (bytes32[] revisionHashes) {
         return internalAuthorgs[authorgAddress].submissions[submissionHash].revisionHashes;
    }

    function doesPostReferencePost(address postUserAddress, 
                                    address originalPostUserAddress, 
                                    uint originalPostSubmissionHash, 
                                    bytes32 originalPostRevisionHash) 
                                    constant returns (bool) 
    {
        Revision rev = internalAuthorgs[originalPostUserAddress].submissions[originalPostSubmissionHash].revisions[originalPostRevisionHash];
        return rev.hasUserReferencedRevision[postUserAddress];
    }

    function constDoesPostReferencePost(address postUserAddress, 
                                    address originalPostUserAddress, 
                                    uint originalPostSubmissionHash, 
                                    bytes32 originalPostRevisionHash) 
                                    constant returns (bool) 
    {
        Revision rev = internalAuthorgs[originalPostUserAddress].submissions[originalPostSubmissionHash].revisions[originalPostRevisionHash];
        return rev.hasUserReferencedRevision[postUserAddress];
    }

}