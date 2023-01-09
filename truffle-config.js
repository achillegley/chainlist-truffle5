module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        ganache: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        //chainskills: {
          //  host: "localhost",
            //port: 8545,
            //network_id: "4224", // Match any network id
            //gas:4700000,
            //from:'0x124fC92241ab974e47cDFe8E88A6C591128FDf98'
        //}
    },
    // Configure your compilers
    compilers: {
        solc: {
            settings: {          // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            },
            version:"0.6.0"
        }
    }
};
