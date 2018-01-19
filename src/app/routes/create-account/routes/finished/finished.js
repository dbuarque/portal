import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {connected} from 'aurelia-redux-connect';

@inject(Router)
export class Finished {
    @connected('createAccount.publicKey')
    publicKey;

    constructor(router) {
        this.router = router;
        this.nativeAssetCode = window.stellarport.stellar.nativeAssetCode;
        this.accountMinBalance = window.stellarport.stellar.baseReserve * 2;
    }

    goToLogin() {
        this.router.navigateToRoute('login');
    }
}

