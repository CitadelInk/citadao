var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Citadel = artifacts.require('./Citadel.sol')

module.exports = function (deployer, done) {
  var citadel, token;
  deployer.deploy(Citadel);
}