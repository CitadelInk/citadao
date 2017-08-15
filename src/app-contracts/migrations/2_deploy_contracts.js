var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var CitadelLib = artifacts.require('./Citadel.sol')

module.exports = function (deployer) {
  deployer.deploy(MyAdvancedToken, 10000000, "CITA", 2, "CITA")
}