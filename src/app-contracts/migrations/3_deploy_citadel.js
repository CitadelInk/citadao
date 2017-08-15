var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Citadel = artifacts.require('./Citadel.sol')

module.exports = function (deployer, done) {
  var citadel, token;
  deployer.deploy(Citadel, MyAdvancedToken.address).then(function() {
    return MyAdvancedToken.deployed();
  }).then(function(instance) {
    token = instance;
    return token.setCitadelAddress(Citadel.address);
  })
}