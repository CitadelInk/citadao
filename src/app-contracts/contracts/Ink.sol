pragma solidity ^0.4.13;

contract AbstractWallet {
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}

contract Managed {
    address public ink_comptroller;  
    modifier onlyComptroller {
        require(msg.sender == ink_comptroller);
        _;
    }
}

contract Ink is Managed {

    event BioUpdated(address indexed _from, bytes32 _value);

    address public wallet_address;
    uint256 public bio_update_in_ink;
    uint256 public reaction_cost_in_ink;
    uint256 public submit_revision_cost_in_ink; 
    uint256 public submit_submission_cost_in_ink; 
    
    function Ink(address wallet, uint bioCost, uint256 reactionCost, uint256 revisionCost, uint256 submissionCost) {
        ink_comptroller = msg.sender;
        wallet_address = wallet;
        bio_update_in_ink = bioCost;
        reaction_cost_in_ink = reactionCost;
        submit_revision_cost_in_ink = revisionCost;
        submit_submission_cost_in_ink = submissionCost;
    }
    
    struct Authorg {
        Submission selfBioSubmission;       

        mapping(bytes32 => Submission) submissions;

        uint[] postKeyIndexes;
    }

    struct Submission {
        bytes32 citadelManifestHash;
        mapping(bytes32 => Revision) revisions;
        bytes32[] revisionHashes;
    }
    
    struct Revision {
        uint timestamp;
        bytes32 citadelManifestHash;

        address[] referenceKeyAuthorgs;
        bytes32[] referenceKeySubmissions;
        bytes32[] referenceKeyRevisions;
    }

    struct SubRevKey {
        bytes32 submissionHash;
        bytes32 revisionHash;
    }

    struct AuthSubRevKey {
        address authorgAddress;
        bytes32 submissionHash;
        bytes32 revisionHash;
    }

    
    mapping(address => Authorg) internalAuthorgs;
    
    // solidity compliation seems to cry when we store these types of keys as a struct, 
    // so we're just using multiple parallel arrays everywhere (for now)
    address[] allPostAuthorgs;
    bytes32[] allPostSubmissions;
    bytes32[] allPostRevisions;
    
    function spend(uint256 value) private {
        AbstractWallet(wallet_address).transferFrom(msg.sender, wallet_address, value);
    }
    
    function setWalletAddress(address newWalletAddress) onlyComptroller {
        wallet_address = newWalletAddress;
    }

    function getBioRevisions(address authorgAddress) constant returns (bytes32[] hashes) {
        return internalAuthorgs[authorgAddress].selfBioSubmission.revisionHashes;
    }

    function getTotalAuthSubRevKeyCount() constant returns (uint) {
        if (allPostAuthorgs.length != allPostSubmissions.length || allPostAuthorgs.length != allPostRevisions.length) {
            return 0;
        } else {
            return allPostAuthorgs.length;
        }
    }

    function getAuthSubRevKey(uint index) constant returns (address, bytes32, bytes32, uint) {
        var authorg = allPostAuthorgs[index];
        var submission = allPostSubmissions[index];
        var revision = allPostRevisions[index];
        var timestamp = internalAuthorgs[authorg].submissions[submission].revisions[revision].timestamp;
        return (authorg, submission, revision, timestamp);
    }
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        spend(bio_update_in_ink);
        var newAuthorgs = new address[](0);
        var newSubmissions = new bytes32[](0);
        var newRevisions = new bytes32[](0);
        internalAuthorgs[msg.sender].selfBioSubmission.revisionHashes.push(citadelManifestHash);
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
    
    function isAuthorgOfSubmission(address authorgAddress, bytes32 submissionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.revisionHashes.length != 0;
    }
    
    function isAuthorgOfBio(address authorgAddress, bytes32 bioRevisionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        authorg.selfBioSubmission.revisions[bioRevisionHash].citadelManifestHash != 0;
    }
    
    function isAuthorgOfSubmissionRevision(address authorgAddress, bytes32 submissionHash, bytes32 revisionHash) constant returns (bool) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.revisions[revisionHash].citadelManifestHash != 0;
    }

    function submitSubmission(bytes32 subCitadelManifestHash) {
        spend(submit_submission_cost_in_ink);
        submitRevision(msg.sender, subCitadelManifestHash, subCitadelManifestHash);
    }

    function submitRevisionWithReferences(bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash, address[] refKeyAuthorgs, bytes32[] refKeySubmissions, bytes32[] refKeyRevisions) {
        submitRevision(subCitadelManifestHash, revCitadelManifestHash);
        require(refKeyAuthorgs.length == refKeySubmissions.length);
        require(refKeyAuthorgs.length == refKeyRevisions.length);

        for (uint i = 0; i < refKeyAuthorgs.length; i++) {
            respondToAuthorgSubmissionRevision(refKeyAuthorgs[i], refKeySubmissions[i], refKeyRevisions[i], subCitadelManifestHash, revCitadelManifestHash);
        }
    }
    
    function submitRevision(bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash) {
        spend(submit_revision_cost_in_ink);
        submitRevision(msg.sender, subCitadelManifestHash, revCitadelManifestHash);
    }
    
    function submitRevision(address sender, bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash) private {
        Authorg authorg = internalAuthorgs[sender];

        // never submitted revision to this submission before        
        require (authorg.submissions[subCitadelManifestHash].revisions[revCitadelManifestHash].citadelManifestHash == 0);
        
        var newAuthorgs = new address[](0);
        var newSubmissions = new bytes32[](0);
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
        internalAuthorgs[sender].submissions[subCitadelManifestHash].citadelManifestHash = subCitadelManifestHash;
        internalAuthorgs[sender].postKeyIndexes.push(allPostRevisions.length);
        allPostAuthorgs.push(sender);
        allPostSubmissions.push(subCitadelManifestHash);
        allPostRevisions.push(revCitadelManifestHash);
    }
    
    function respondToAuthorgSubmissionRevision(address originalAuthorgAddress, bytes32 originalSubmissionHash, bytes32 originalRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        require (isAuthorgOfSubmissionRevision(msg.sender, responseSubmissionHash, responseRevisionHash));
        spend(1);
        var originalAuthorg = internalAuthorgs[originalAuthorgAddress];
        var originalSubmission = originalAuthorg.submissions[originalSubmissionHash];
        var originalRevision = originalSubmission.revisions[originalRevisionHash];

        originalRevision.referenceKeyAuthorgs.push(msg.sender);
        originalRevision.referenceKeySubmissions.push(responseSubmissionHash);
        originalRevision.referenceKeyRevisions.push(responseRevisionHash);
    }

    function getNumberReferencesForAuthorgSubmissionRevision(address authorgAddress, bytes32 submissionHash, bytes32 revisionHash) constant returns (uint) {
        return internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash].referenceKeyRevisions.length;
    }

    function getReferenceForAuthorgSubmissionRevision(address authorgAddress, bytes32 submissionHash, bytes32 revisionHash, uint index) constant returns(address, bytes32, bytes32) {
        Revision rev = internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash];
        return (rev.referenceKeyAuthorgs[index], rev.referenceKeySubmissions[index], rev.referenceKeyRevisions[index]);
    }

    function getPostKeyCountForAuthorg(address authorgAddress) constant returns (uint) {
        return internalAuthorgs[authorgAddress].postKeyIndexes.length;
    }

    function getAuthorgPostKey(address authAdd, uint indexIndex) constant returns (address authorgAddress, bytes32 submissionHash, bytes32 revisionHash, uint timestamp) {
        uint index = internalAuthorgs[authAdd].postKeyIndexes[indexIndex];
        return (getAuthSubRevKey(index));
    }

    function getTimestampForRevision(address authorgAddress, bytes32 submissionHash, bytes32 revisionHash) constant returns(uint) {
        return internalAuthorgs[authorgAddress].submissions[submissionHash].revisions[revisionHash].timestamp;
    }
}