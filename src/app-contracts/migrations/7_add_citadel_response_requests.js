var Ink = artifacts.require('./Ink')
var CitadelResponseRequest = artifacts.require('./CitadelResponseRequest.sol')

module.exports = function (deployer) {
  console.log("deploying with ink address. - " + Ink.address);
  deployer.deploy(CitadelResponseRequest, Ink.address, (24 * 60));
}