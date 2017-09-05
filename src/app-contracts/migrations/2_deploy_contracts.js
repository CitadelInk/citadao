var MyAdvancedToken = artifacts.require('./MyAdvancedToken')

module.exports = function (deployer) {
    return deployer.deploy(MyAdvancedToken, 10000000, "INK", 2, "INK", 1)
}