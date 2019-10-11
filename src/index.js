const ProviderEngine = require("web3-provider-engine");
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters');
const WalletSubprovider = require('./walletProvider');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const EthereumjsWallet = require('ethereumjs-wallet');

function PrivateKeyProvider(privateKey, providerUrl, network='mainnet') {
    if (!privateKey) {
        throw new Error(`Private Key missing, non-empty string expected, got "${privateKey}"`);
    }

    if (!providerUrl) {
        throw new Error(`Provider URL missing, non-empty string expected, got "${providerUrl}"`);
    }

    this.wallet = EthereumjsWallet.fromPrivateKey(new Buffer(privateKey, "hex"));
    this.address = "0x" + this.wallet.getAddress().toString("hex");

    this.engine = new ProviderEngine();

    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new WalletSubprovider(this.wallet, {}, network));
    this.engine.addProvider(new RpcSubprovider({ rpcUrl: providerUrl }));

    this.engine.start();
}

PrivateKeyProvider.prototype.sendAsync = function() {
    this.engine.sendAsync.apply(this.engine, arguments);
};

PrivateKeyProvider.prototype.send = function() {
    this.engine.sendAsync.apply(this.engine, arguments);
};


module.exports = PrivateKeyProvider;
