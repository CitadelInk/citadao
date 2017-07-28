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
    address public wallet_address;
    
    function Citadel(address wallet) {
        citadel_comptroller = msg.sender;
        wallet_address = wallet;
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
    }
    
    mapping(address => Authorg) internalAuthorgs;
    
    function spend(uint256 value) private {
        AbstractWallet(wallet_address).transferFrom(msg.sender, wallet_address, value);
    }
    
    function setWalletAddress(address newWalletAddress) onlyComptroller {
        wallet_address = newWalletAddress;
    }
    
    function submitBioRevision(bytes32 citadelManifestHash) {
        spend(50);
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
        spend(50);
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
            spend(5);
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            internalAuthorgs[originalAuthorgAddress].selfBioSubmission.submissionRevisionMap[originalSubmissionRevisionHash].responseManifestHashes.push(responseSubmissionHash);
        }
    }
    
    function respondToSubmission(address originalAuthorgAddress, bytes32 originalSubmissionHash, bytes32 originalSubmissionRevisionHash, bytes32 responseSubmissionHash, bytes32 responseRevisionHash) {
        if(isAuthorgOfSubmissionRevision(originalAuthorgAddress, originalSubmissionHash, originalSubmissionRevisionHash)) {
            spend(5);
            submitRevision(msg.sender, responseSubmissionHash, responseRevisionHash);
            var authorg = internalAuthorgs[originalAuthorgAddress];
            var submission = authorg.submissions[originalSubmissionHash];
            var revision = submission.submissionRevisionMap[originalSubmissionRevisionHash];
            revision.responseManifestHashes.push(responseRevisionHash);
        }
    }
}