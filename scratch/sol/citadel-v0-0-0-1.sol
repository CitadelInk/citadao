pragma solidity ^0.4.11;
contract Citadelv01 {
    address public citadel_comptroller;
    
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
    }
    
    mapping(address => Authorg) internalAuthorgs;
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        var newResponseArray = new bytes32[](0);
        internalAuthorgs[msg.sender].selfBioSubmission.submissionRevisionHashes.push(citadelManifestHash);
        var revision = Revision({
            citadelManifestHash : citadelManifestHash,
            responseManifestHashes : newResponseArray
        });
        internalAuthorgs[msg.sender].selfBioSubmission.submissionRevisionMap[citadelManifestHash] = revision;

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
        
    }
    
    function respondToBio(address originalAuthorgAddress, bytes32 originalSubmissionRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        if(isAuthorgOfBio(originalAuthorgAddress, originalSubmissionRevisionHash)) {
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            internalAuthorgs[originalAuthorgAddress].selfBioSubmission.submissionRevisionMap[originalSubmissionRevisionHash].responseManifestHashes.push(responseSubmissionHash);
        }
    }
    
    function respondToSubmission(address originalAuthorgAddress, bytes32 originalSubmissionHash, bytes32 originalSubmissionRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        if(isAuthorgOfSubmissionRevision(originalAuthorgAddress, originalSubmissionHash, originalSubmissionRevisionHash)) {
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            var authorg = internalAuthorgs[originalAuthorgAddress];
            var submission = authorg.submissions[originalSubmissionHash];
            var revision = submission.submissionRevisionMap[originalSubmissionRevisionHash];
            revision.responseManifestHashes.push(responseRevisionHash);
        }
    }
}