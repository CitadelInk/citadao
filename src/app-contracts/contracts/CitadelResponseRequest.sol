pragma solidity ^0.4.13;

contract AbstractInk {
    function doesPostReferencePost(address postUserAddress, 
                                    address originalPostUserAddress, 
                                    uint originalPostsubmissionIndex, 
                                    bytes32 originalPostRevisionHash) public constant returns (bool isPostRef);
}

contract CitadelResponseRequest {

    event ResponseRequestCreated(address indexed _offererUser, 
                                address indexed _recipientUser, 
                                address _postUser, 
                                uint _postSumission, 
                                bytes32 _postRevision);

    event PostResponseRequestCreated(address indexed _postUser, 
                                    uint indexed _postSumission, 
                                    bytes32 indexed _postRevision, 
                                    address _offererUser, 
                                    address _recipientUser);

    event ResponseRequestBountyCollected(address indexed _offererUser, 
                                        address indexed _recipientUser, 
                                        address _postUser, 
                                        uint _postSumission, 
                                        bytes32 _postRevision);

    event PostResponseRequestBountyCollected(address indexed _postUser, 
                                            uint indexed _postSumission, 
                                            bytes32 indexed _postRevision, 
                                            address _offererUser, 
                                            address _recipientUser);

    event ResponseRequestBountyRefunded(address indexed _offererUser, 
                                        address indexed _recipientUser, 
                                        address _postUser, 
                                        uint _postSumission, 
                                        bytes32 _postRevision);

    event PostResponseRequestBountyRefunded(address indexed _postUser, 
                                            uint indexed _postSumission, 
                                            bytes32 indexed _postRevision, 
                                            address _offererUser, 
                                            address _recipientUser);


    address public ink_address;

    uint bounty_open_length_in_minutes;

    function CitadelResponseRequest(address ink, uint bountyOpenLengthInMinutes) public {
        ink_address = ink;
        bounty_open_length_in_minutes = bountyOpenLengthInMinutes;
    }

    // and some reaction stuff  
    struct InkAuthorgExtension {
        mapping(uint => InkSubmissionExtension) submissions;

        // these 4 will always have the same length. the 4 elements at each index function as a key to find response requests offered
        address[] responseRequestsOfferedToUsers;
        address[] responseRequestsOfferedToUsersPostUsers;
        uint[] responseRequestsOfferedToUsersPostSubmissions;
        bytes32[] responseRequestsOfferedToUsersPostRevisions;


        // these 4 will always have the same length. the 4 elements at each index function as a key to find response requests received
        address[] responseRequestsReceivedFromUsers;
        address[] responseRequestsReceivedFromUsersPostUsers;
        uint[] responseRequestsReceivedFromUsersPostSubmissions;
        bytes32[] responseRequestsReceivedFromUsersPostRevisions;
    } 

    struct InkSubmissionExtension {
        mapping(bytes32 => InkRevisionExtension) revisions;
    }

    struct InkRevisionExtension {
        mapping(address => mapping(address => ResponseRequestReceipt)) userToResponderToRequestReceipt;
        address[] responseRequestOffererUsers;
        address[] responseRequestRecipientUsers;
    }           

    struct ResponseRequestReceipt {
        bool exists;
        uint timestampCreated;
        uint bounty;
        bool hasBeenCollected;
        bool hasBeenRefunded;
    }

    mapping(address => InkAuthorgExtension) authorgExtensionMap;


    // transactions
    
    function submitResponseRequest(address userToRespond, 
                                    address postUser, 
                                    uint postSubmission, 
                                    bytes32 postRevision) 
    public payable 
    {
        
        require(userToRespond != msg.sender); // can't ask self to respond
        require(userToRespond != postUser); // can't ask user to respond directly to themselves
        //require(msg.value > bounty_fee);
        
        var request = ResponseRequestReceipt({
            exists : true,
            timestampCreated : block.timestamp,
            bounty : msg.value,
            hasBeenCollected : false,
            hasBeenRefunded : false
        });
       
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



       authorgExtensionMap[msg.sender].responseRequestsOfferedToUsers.push(userToRespond);
       authorgExtensionMap[msg.sender].responseRequestsOfferedToUsersPostUsers.push(postUser);
       authorgExtensionMap[msg.sender].responseRequestsOfferedToUsersPostSubmissions.push(postSubmission);
       authorgExtensionMap[msg.sender].responseRequestsOfferedToUsersPostRevisions.push(postRevision);

       authorgExtensionMap[userToRespond].responseRequestsReceivedFromUsers.push(msg.sender);
       authorgExtensionMap[userToRespond].responseRequestsReceivedFromUsersPostUsers.push(postUser);
       authorgExtensionMap[userToRespond].responseRequestsReceivedFromUsersPostSubmissions.push(postSubmission);
       authorgExtensionMap[userToRespond].responseRequestsReceivedFromUsersPostRevisions.push(postRevision);

       ResponseRequestCreated(msg.sender, userToRespond, postUser, postSubmission, postRevision);
       PostResponseRequestCreated(postUser, postSubmission, postRevision, msg.sender, userToRespond);
    }

    function getInkAddress() public constant returns (address) {
        return ink_address;
    }

    function doesUserReferencePost(address user, address postUser, uint postSubmission, bytes32 postRevision) public constant returns (bool) {
        return AbstractInk(ink_address).doesPostReferencePost(user, postUser, postSubmission, postRevision);
    }

    function collectResponseRequestBounty(address offerUser, address postUser, uint postSubmission, bytes32 postRevision) public {

        var receipt = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[offerUser][msg.sender];

        require(receipt.exists);

        var hasReferenced = AbstractInk(ink_address).doesPostReferencePost(msg.sender, postUser, postSubmission, postRevision);
        require(hasReferenced);

        require(!receipt.hasBeenCollected);

        var withinBountyLimit = now < (receipt.timestampCreated + (bounty_open_length_in_minutes * 1 minutes));
        require(withinBountyLimit);
            
        receipt.hasBeenCollected = true;
        
        var bounty = receipt.bounty;

        msg.sender.transfer(bounty);

        ResponseRequestBountyCollected(offerUser, msg.sender, postUser, postSubmission, postRevision);
        PostResponseRequestBountyCollected(postUser, postSubmission, postRevision, offerUser, msg.sender);
    }

    function refundResponseRequestBounty(address recipientUser, address postUser, uint postSubmission, bytes32 postRevision) public {

        var receipt = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[msg.sender][recipientUser];

        require(receipt.exists);
        require(!receipt.hasBeenCollected && !receipt.hasBeenRefunded);

        //var outsideBountyLimit = now > (receipt.timestampCreated + (bounty_open_length_in_minutes * 1 minutes));
        //require(outsideBountyLimit);

        receipt.hasBeenRefunded = true;
        
        var bounty = receipt.bounty;

        msg.sender.transfer(bounty);

        ResponseRequestBountyRefunded(msg.sender, recipientUser, postUser, postSubmission, postRevision);
        PostResponseRequestBountyRefunded(postUser, postSubmission, postRevision, msg.sender, recipientUser);
    
    }

    // constant functions

    /*function hasUserMadeOfferOnPost(address offerUser, address postUser, bytes32 postSubmission, bytes32 postRevision) constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponseRequestOfferer[offerUser].exists;
    }*/

    function getUserBountiesCreated(address user) 
        public constant returns (address[] recipientUsers, address[] postUsers, uint[] postSubmissions, bytes32[] postRevisions) {
        recipientUsers = authorgExtensionMap[user].responseRequestsOfferedToUsers;
        postUsers = authorgExtensionMap[user].responseRequestsOfferedToUsersPostUsers;
        postSubmissions = authorgExtensionMap[user].responseRequestsOfferedToUsersPostSubmissions;
        postRevisions = authorgExtensionMap[user].responseRequestsOfferedToUsersPostRevisions;
    }

    function getUserBountiesReceived(address user) 
        public constant returns (address[] offererUsers, address[] postUsers, uint[] postSubmissions, bytes32[] postRevisions) {
        offererUsers = authorgExtensionMap[user].responseRequestsReceivedFromUsers;
        postUsers = authorgExtensionMap[user].responseRequestsReceivedFromUsersPostUsers;
        postSubmissions = authorgExtensionMap[user].responseRequestsReceivedFromUsersPostSubmissions;
        postRevisions = authorgExtensionMap[user].responseRequestsReceivedFromUsersPostRevisions;
    }

    function hasUserMadeOfferOnPostToUser(address offerUser, 
                                            address recipientUser, 
                                            address postUser, 
                                            uint postSubmission, 
                                            bytes32 postRevision) 
                                            public constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponderToRequestReceipt[offerUser][recipientUser].exists;
    }

    function hasUserCollectedBounty(address recipientUser, 
                                    address offerUser, 
                                    address postUser, 
                                    uint postSubmission, 
                                    bytes32 postRevision) 
                                    public constant returns (bool) {
        return authorgExtensionMap[postUser].submissions[postSubmission].revisions[postRevision].userToResponderToRequestReceipt[offerUser][recipientUser].hasBeenCollected;
    }


    function getOffererRecipientKeysForPost(address postUser, uint postSubmission, bytes32 postRevision) public constant returns (address[] offerers, address[] recipients) {
        offerers = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestOffererUsers;

        recipients = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .responseRequestRecipientUsers;
    }

    function getReceipt(address postUser, uint postSubmission, bytes32 postRevision, address offererUser, address recipientUser) 
    public constant returns (bool exists, uint timestamp, uint bounty, bool collected, bool referenced, bool refunded)
    {
        var receipt = authorgExtensionMap[postUser]
            .submissions[postSubmission]
            .revisions[postRevision]
            .userToResponderToRequestReceipt[offererUser][recipientUser];

        var hasReferenced = AbstractInk(ink_address).doesPostReferencePost(msg.sender, postUser, postSubmission, postRevision);

        return (receipt.exists, receipt.timestampCreated, receipt.bounty, receipt.hasBeenCollected, hasReferenced, receipt.hasBeenRefunded);
    }
}