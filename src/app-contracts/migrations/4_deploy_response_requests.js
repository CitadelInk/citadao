var CitadelResponseRequest = artifacts.require('./CitadelResponseRequest.sol')

module.exports = function (deployer, done) {
  deployer.deploy(CitadelResponseRequest);
}