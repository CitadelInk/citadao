// add helper methods here to interface with the contracts basic functionality 


const contract = require('truffle-contract')

const contractNames = [ 'Citadel', 'Ink', 'CitadelResponseRequest' ]
let contracts = {}
contractNames.forEach(function (name) {
  const json = require(`./build/contracts/${name}.json`)
  console.log(json)
  contracts[name] = contract(json)
})

function setProvider (web3Provider) {
  for (let name in contracts) {
    let contract = contracts[name];
    contract.setProvider(web3Provider)
  }
}

function setNetwork (web3Provider) {
  for (let name in contracts) {
    contracts[name].setNetwork(web3Provider)
  }
}

module.exports = Object.assign({}, contracts, {
  setProvider: setProvider,
  setNetwork: setNetwork
})
