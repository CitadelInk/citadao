pragma solidity ^0.4.11;


contract Citadelv01 {
    

	address public citadel_comptroller;
    
    
	struct Authorg {
        
		bytes32[] selfBioRevisions;
        
		mapping(bytes32 => Submission) submissions;

    	}
    
    

	struct Page {
        
		Submission[] pageSubmissionRevisions;

	}

	struct Submission {
        
		bytes32 citadelManifestHash;

        	//bytes32[] responseManifestHashes;

    	}


	
mapping(address => Authorg) internalAuthorgs;

	
function submitBio(bytes32 citadelManifestHash) {

		internalAuthorgs[msg.sender].submissions[citadelManifestHash] = Submission({

			citadelManifestHash : citadelManifestHash

		});

	}


	
function isAuthorOfSubmission(address authorgAddress, bytes32 submissionHash) returns (bool isAuthor) {

		var authorg = internalAuthorgs[authorgAddress];

		var submission = authorg.submissions[submissionHash];

		return submission.citadelManifestHash == submissionHash;

	}

}