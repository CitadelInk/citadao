var Ink = artifacts.require('./Ink.sol')

module.exports = function (deployer, done) {
  deployer.deploy(Ink, 10, 1, 10, 10);
}