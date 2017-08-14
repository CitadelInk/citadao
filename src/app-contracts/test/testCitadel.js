/*var Box = require("truffle-box");
var MemoryLogger = require("../memorylogger");
var CommandRunner = require("../commandrunner");
var contract = require("truffle-contract");
var fs = require("fs-extra");
var path = require("path");
var assert = require("assert");
var Reporter = require("../reporter");
var Server = require("../server");*/
//var Web3 = require("web3");

/*contract('TestCitadel', function(accounts) {
  it("should assert true", function(done) {
    var example = TestCitadel.deployed();
    assert.isTrue(true);
    done();
  });
});
*/

contract('Citadel', function(accounts) {
  it("should assert true", function(done) {
    var example = Citadel.deployed();
    assert.isTrue(true);
    done();
  })
})