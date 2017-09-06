var MyAdvancedToken = artifacts.require('./MyAdvancedToken')
var Ink = artifacts.require('./Ink.sol')

module.exports = function (deployer, done) {
  var ink, token;
  deployer.deploy(Ink, MyAdvancedToken.address, 10, 1, 10, 10).then(function() {
    return MyAdvancedToken.deployed();
  }).then(function(instance) {
    token = instance;
    return token.setInkAddress(Ink.address);
  })
}