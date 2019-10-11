# truffle-anduschain-provider

## install
```$xslt
npm install truffle-anduschain-provider
```

## Usage
used in truffle-config.js
```$xslt
const AnducChainPrivateKeyProvider = require('truffle-anduschain-provider');
const privateKey = "685a12175c6aadc83ba852e65599ac6148f807edd16ba4e5093d4839ddf2cb44"; // address 0xfEF6f81c2C9E1fa327cAD572d352B913Bc074A0D
module.exports = {
    // Uncommenting the defaults below
    // provides for an easier quick-start with Ganache.
    // You can also follow this format for other networks;
    // see <http://truffleframework.com/docs/advanced/configuration>
    // for more details on how to specify configuration options!

    // http://rcp.server.io:8545/ -- rpc server
    networks: {
        development: {
            network_id: "*",
            gasPrice : 23809523805524, // for anduschain gasprice
            provider: function() {
                return new AnducChainPrivateKeyProvider(privateKey, 'http://rcp.server.io::8545/', 'testnet');
            },
        },
    }
};
```
