// const inherits = require('util').inherits
const HookedWalletProvider = require('web3-provider-engine/subproviders/hooked-wallet');
const { Transaction } = require('anduschain-js');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

class HookedWalletEthTxSubprovider extends HookedWalletProvider {
    constructor(opts) {
        super(opts);
        this.opts = opts;
    }

    signTransaction = (txData, cb) => {
        // defaults
        if (txData.gas !== undefined) txData.gasLimit = txData.gas;
        txData.value = txData.value || '0x00';
        txData.data = ethUtil.addHexPrefix(txData.data);

        this.opts.getPrivateKey(txData.from, function(err, privateKey, network) {
            if (err) return cb(err);
            const tx = new Transaction(txData, network);
            tx.sign(privateKey);
            cb(null, '0x' + tx.serialize().toString('hex'))
        })
    };

    signMessage = (msgParams, cb) => {
        this.opts.getPrivateKey(msgParams.from, function(err, privateKey) {
            if (err) return cb(err)
            const dataBuff = ethUtil.toBuffer(msgParams.data);
            const msgHash = ethUtil.hashPersonalMessage(dataBuff);
            const sig = ethUtil.ecsign(msgHash, privateKey)
            const serialized = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
            cb(null, serialized)
        })
    };

    signPersonalMessage = (msgParams, cb) => {
        this.opts.getPrivateKey(msgParams.from, function(err, privateKey) {
            if (err) return cb(err);
            const serialized = sigUtil.personalSign(privateKey, msgParams);
            cb(null, serialized)
        })
    };

    signTypedMessage = (msgParams, cb) =>{
        this.opts.getPrivateKey(msgParams.from, function(err, privateKey) {
            if (err) return cb(err);
            const serialized = sigUtil.signTypedData(privateKey, msgParams);
            cb(null, serialized)
        })
    };

}

function concatSig(v, r, s) {
    r = ethUtil.fromSigned(r);
    s = ethUtil.fromSigned(s);
    v = ethUtil.bufferToInt(v);
    r = ethUtil.toUnsigned(r).toString('hex').padStart(64, 0);
    s = ethUtil.toUnsigned(s).toString('hex').padStart(64, 0);
    v = ethUtil.stripHexPrefix(ethUtil.intToHex(v));
    return ethUtil.addHexPrefix(r.concat(s, v).toString("hex"))
}


module.exports = HookedWalletEthTxSubprovider;
