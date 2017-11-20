var Citadel = artifacts.require('./Citadel.sol')

module.exports = function (deployer, done) {
  deployer.deploy(Citadel);
}