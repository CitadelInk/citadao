var MyAdvancedToken = artifacts.require('./MyAdvancedToken.sol')
var CitadelLib = artifacts.require('./Citadel.sol')

module.exports = function (deployer) {
  deployer.deploy(MyAdvancedToken, 10000, "POOP", 2, "PEEE")
}