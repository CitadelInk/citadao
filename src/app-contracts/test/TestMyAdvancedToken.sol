pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Citadel.sol";
import "../contracts/Token.sol";

contract TestMyAdvancedToken {

  function testInitialValueMyAdvancedToken() {
    uint expected = 10000;
    MyAdvancedToken token = MyAdvancedToken(DeployedAddresses.MyAdvancedToken());
    Assert.equal(token.getInitalSupply(), expected, "initial supply should have 10000 MyAdvancedToken");
  }
}