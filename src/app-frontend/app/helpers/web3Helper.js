import Web3 from 'web3'
import appContracts from 'app-contracts'
import config from "../config.json"

let web3Provider
// this will be true if using Mist/MetaWHAVETER
if (typeof web3 !== 'undefined') {
    web3Provider = web3.currentProvider
} else {
    // See remove for how this works! 
    console.log(config)
    web3Provider = new Web3.providers.HttpProvider(`http://${config.Server}:8545`)
}

const localWeb3 = new Web3(web3Provider)
export default localWeb3