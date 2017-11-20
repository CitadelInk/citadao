
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4612388
    },
    oldproduction: {
      host: '104.236.160.22',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4612388
    },
    production: {
      host: '107.170.218.201',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4612388
    }

  }
}