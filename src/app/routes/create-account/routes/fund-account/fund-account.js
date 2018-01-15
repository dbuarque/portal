import {connected} from 'aurelia-redux-connect';

export class FundAccount {
    @connected('createAccount.publicKey')
    publicKey;

    constructor() {
        this.nativeAssetCode = window.stellarport.stellar.nativeAssetCode;
        this.accountMinBalance = window.stellarport.stellar.baseReserve * 2;
    }
}
