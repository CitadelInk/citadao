pragma solidity ^0.4.13;

contract AbstractInk {
    function doesPostReferencePost(address postUserAddress, address originalPostUserAddress, bytes32 originalPostSubmissionHash, bytes32 originalPostRevisionHash) constant returns (bool isPostRef);
}

contract CitadelResponseRequest {

    //event ReactionRecorded(address indexed _postAuthorg, bytes32 indexed _postSubmission, bytes32 indexed _postRevision);

    address public ink_address;
    //uint bounty_fee;

    function CitadelResponseRequest(address ink/*, uint bountyFee*/) {
        ink_address = ink;
        //bounty_fee = bountyFee;
    }

    // and some reaction stuff  
    struct InkAuthorgExtension {
        mapping(bytes32 => InkSubmissionExtension) submissions;

        // these 4 will always have the same length. the 4 elements at each index functoin as a key to find response requests offered
        address[] responseRequestsOfferedToUsers;
        address[] responseRequestsOfferedPostUsers;
        bytes32[] responseRequestsOfferedPostSubmissions;
        bytes32[] responseRequestsOfferedPostRevisions;


        // these 4 will always have the same length. the 4 elements at each index functoin as a key to find response requests received
        address[] responseRequestsReceivedFromUsers;
        address[] responseRequestsReceivedPostUsers;
        bytes32[] responseRequestsReceivedPostSubmissions;
        bytes32[] responseRequestsReceivedPostRevisions;
    } 

    struct InkSubmissionExtension {
        mapping(bytes32 => InkRevisionExtension) revisions;
    }

    struct InkRevisionExtension {
        //ResponseRequest[] responseRequestsOnPost;
        mapping(address => mapping(address => ResponseRequestReceipt)) userToResponderToRequestReceipt;
        address[] responseRequestOffererUsers;
        address[] responseRequestRecipientUsers;
    }           

    struct ResponseRequestReceipt {
        bool exists;
        /*address requestingUserAddress;
        address respondingUserAddress;
        address postUserAddress;
        bytes32 postSubmissionHash;
        bytes32 postRevisionHash;*/
        uint timestampCreated;
        uint bounty;
        bool hasBeenCollected;
    }

    mapping(address => InkAuthorgExtension) authorgExtensionMap;


    // transactions
    
    function submitResponseRequest(address userToRespond, 
                                    address postUser, 
                                    bytes32 postSubmission, 
                                    bytes32 postRevision) 
    public payable 
    {
        
        require(userToRespond != msg.sender); // can't ask self to respond
        require(userToRespond != postUser); // can't ask user to respond directly to themselves
        //require(msg.value > bounty_fee);
        
        var request = ResponseRequestReceipt({
            exists : true,
            /*requestingUserAddress : msg.sender,
            respondingUserAddress : userToRespond,
            postUserAddress : postUser,
            postSubmissionHash : postSubmission,
            postRevisionHash : postRevision,*/
            timestampCreated : block.timestamp,
            bounty : msg.value,
            hasBeenCollected : false
        });

        // require doesn't have this response request open
       
        var hasUserMadeOfferOnPostToUserAlready = hasUserMadeOfferOnPostToUser(msg.sender, userToRespond, postUser, postSubmission, postRevision);
        require(!hasUserMadeOfferOnPostToUserAlready);
    
        authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[msg.sender][userToRespond] = request;
                
        authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestOffererUsers.push(msg.sender);

        authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestRecipientUsers.push(userToRespond);
    }

    function getInkAddress() constant returns (address) {
        return ink_address;
    }

    function doesUserReferencePost(address user, address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (bool) {
        return AbstractInk(ink_address).doesPostReferencePost(user, postUser, postSubmission, postRevision);
    }

    function collectResponseRequestBounty(address offerUser, address postUser, bytes32 postSubmission, bytes32 postRevision) {
        var hasReferenced = AbstractInk(ink_address).doesPostReferencePost(msg.sender, postUser, postSubmission, postRevision);
        require(hasReferenced);

        var hasCollected = hasUserCollectedBounty(msg.sender, offerUser, postUser, postSubmission, postRevision);
        require (!hasCollected);
            
        authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[offerUser][msg.sender].hasBeenCollected = true;
        
        var bounty = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[offerUser][msg.sender].bounty;

        msg.sender.transfer(bounty);
    }

    // constant functions

    /*function hasUserMadeOfferOnPost(address offerUser, address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponseRequestOfferer[offerUser].exists;
    }*/

    function hasUserMadeOfferOnPostToUser(address offerUser, address recipientUser, address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponderToRequestReceipt[offerUser][recipientUser].exists;
    }

    function hasUserCollectedBounty(address recipientUser, address offerUser, address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponderToRequestReceipt[offerUser][recipientUser].hasBeenCollected;
    }


    function getOffererRecipientKeysForPost(address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (address[] offerers, address[] recipients) {
        offerers = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestOffererUsers;

        recipients = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestRecipientUsers;
    }

    function getReceipt(address postUser, bytes32 postSubmission, bytes32 postRevision, address offererUser, address recipientUser) 
    constant returns (bool exists, uint timestamp, uint bounty, bool collected)
    {
        var receipt = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[offererUser][recipientUser];

        return (receipt.exists, receipt.timestampCreated, receipt.bounty, receipt.hasBeenCollected);
    }
}