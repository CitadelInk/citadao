# citadao
All CITADAO/CITADEL work before we go public

### Requirments
Install Yarn: https://yarnpkg.com/lang/en/docs/install/

### Usage

1. Check out a clean copy of this repository
2. Run `yarn run devsetup` to have all Node dependencies installed and local 
modules configured properly.
3. To compile contracts with truffle run `yarn install` within the src/app-contracts folder
4. To Test contracts locally against testrpc run `yarn testrpc` from the root folder in another terminal. 
    * Then run `yarn migrate` within the src/app-contracts folder 
    * Then run `yarn test` in the same folder. This will run the test found within the /test folder (currently there is only one test)


