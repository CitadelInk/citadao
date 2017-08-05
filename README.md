# citadao
All CITADAO/CITADEL work before we go public

### Requirments
Install Yarn: https://yarnpkg.com/lang/en/docs/install/

### Testing Swarm 
1. run yarn upgrade within src/app-contracts
2. run yarn testrpc as normal

### Usage

1. Check out a clean copy of this repository
2. Run `yarn run devsetup` to have all Node dependencies installed and local 
modules configured properly.
3. To compile contracts with truffle run `yarn install` within the src/app-contracts folder
4. To Test contracts locally against testrpc run `yarn testrpc` from the root folder in another terminal. 
    * Then run `yarn migrate` within the src/app-contracts folder 
    * Then run `yarn test` in the same folder. This will run the test found within the /test folder (currently there is only one test)

### Testing Contracts against TestRPC Issues
If you are not running on localhost all your services you may run into issues where you are not seeing the proper contracts and connecting to the proper network this could be because in web3Helper.js its pointing to the improper node. look in config.js within the app folde to see if the lan ip is correct if not change it and refresh the page. This should only be relevant when testing locally aginast testRPC or other test networks running against geth. 

### Running on OSX 
1. install iproute2mac - https://github.com/brona/iproute2mac






