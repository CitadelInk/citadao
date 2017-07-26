pragma solidity ^0.4.11;
contract Citadelv01 {
    address public citadel_comptroller;
    
    struct Authorg {
        Revision[] selfBioRevisions;
        
        mapping(bytes32 => Submission) submissions;
        bytes32[] allAuthorgSubmissionHashes;
    }
    
    struct Submission {
        Revision[] pageSubmissionRevisions;
    }
    
    struct Revision {
        bytes32 citadelManifestHash;
        bytes32[] responseManifestHashes;
    }
    
    mapping(address => Authorg) internalAuthorgs;
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        var newResponseArray = new bytes32[](0);
        internalAuthorgs[msg.sender].selfBioRevisions.push(Revision({
            citadelManifestHash : citadelManifestHash,
            responseManifestHashes : newResponseArray
        }));
    }
    
    function isAuthorOfSubmission(address authorgAddress, bytes32 submissionHash) returns (bool isAuthor) {
        var authorg = internalAuthorgs[authorgAddress];
        var submission = authorg.submissions[submissionHash];
        return submission.pageSubmissionRevisions.length != 0;
    }
    
    function submitRevision(bytes32 subCitadelManifestHash, bytes32 revCitadelManifestHash) {
        internalAuthorgs[msg.sender].allAuthorgSubmissionHashes.push(subCitadelManifestHash);
        var newResponseArray = new bytes32[](0);
        var revisionArray = internalAuthorgs[msg.sender].submissions[subCitadelManifestHash].pageSubmissionRevisions;
        revisionArray.push(Revision({
            citadelManifestHash : revCitadelManifestHash,
            responseManifestHashes : newResponseArray
        }));
        
    }
    
    function respondToBio(address authorgAddress, bytes32 submissionHash, bytes32 responseHash) {
        //submit(submissionHash);
    }
}