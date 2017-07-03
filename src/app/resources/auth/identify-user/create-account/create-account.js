/**
 * Created by istrauss on 6/29/2017.
 */

import {inject, computedFrom} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class CreateAccountCustomElement {

    changellyAlertConfig = {
        type: 'info',
        message: 'After you record the keypair above (ensuring that the secret is stored securely), you can use our partners at Changelly to fund your new stellar account.' +
        ' Stellar will not actually create your account until you fund it with ' + window.lupoex.stellar.nativeAssetCode + '. To fund your stellar account, use the button below.',
        dismissible: false
    };

    createAccountHelpAlertConfig = {
        type: 'info',
        message: 'Want some extra help creating your stellar account? Check out our in depth guide to <a href="http://docs.lupoex.com/getting-started/create-an-account/" target="_blank">creating a stellar account</a>.',
        dismissible: false
    };

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    generateKeypair() {
        this.newKeypair = this.stellarServer.sdk.Keypair.random();
        this.newPublicKey = this.newKeypair.publicKey();
        this.newSecret = this.newKeypair.secret();
    }

    @computedFrom('newSecret')
    get hiddenNewSecret() {
        return this.newSecret ? this.newSecret.split('').map(l => 'x').join('') : '';
    }
}