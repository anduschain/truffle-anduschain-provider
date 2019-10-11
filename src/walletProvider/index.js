const HookedWalletAnduschainTxSubprovider = require('./hooked-wallet-anduschain');

class WalletSubprovider extends HookedWalletAnduschainTxSubprovider {
    constructor(wallet, opts, network) {
        opts.getAccounts = (cb) => {
            cb(null, [ wallet.getAddressString() ])
        };

        opts.getPrivateKey = (address, cb) => {
            if (address.toLowerCase() !== wallet.getAddressString()) {
                return cb('Account not found')
            }

            cb(null, this.wallet.getPrivateKey(), network)
        };

        super(opts);
        this.wallet = wallet;
    }

    getAccounts = (cb) => {
        cb(null, [ this.wallet.getAddressString() ])
    };

    getPrivateKey = (address, cb) => {
        if (address.toLowerCase() !== this.wallet.getAddressString()) {
            return cb('Account not found')
        }

        cb(null, this.wallet.getPrivateKey())
    };
}

module.exports = WalletSubprovider;
