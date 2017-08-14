pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Citadel.sol";
import "../contracts/Token.sol";

contract TestCitadel {

 // function TestCitadel() {}
  function testTempHash() {
    bytes32 tempHash = 0xb93621620eee3a1abb37c98d8665c602b9fecdb3141011f3f1da9ababab4e7a7;
    Citadel citadel = Citadel(DeployedAddresses.Citadel());
    citadel.submitTempHash(tempHash);
    bytes32 returnedHash = citadel.getTempHash(tx.origin);
    Assert.equal(returnedHash, tempHash, "temp hash returned should be same as tempHash");
  }
}