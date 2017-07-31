var MyAdvancedToken = artifacts.require('./MyAdvancedToken.sol')
var Citadel = artifacts.require('./Citadel.sol')

module.exports = function (deployer) {
  deployer.deploy(Citadel, MyAdvancedToken.address);
}