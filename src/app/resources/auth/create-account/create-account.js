/**
 * Created by istrauss on 6/29/2017.
 */

import {computedFrom} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';

export class CreateAccountCustomElement {

    changellyAlertConfig = {
        type: 'info',
        message: 'After you record the keypair above (<span class="error-text"><strong>Please be sure that the secret key is stored securely, a hacked or lost secret key will mean loss of all funds</strong></span>), you can use our partners at Changelly to fund your new stellar account.' +
        ' Stellar will not actually create your account until you fund it with ' + window.stellarport.stellar.nativeAssetCode + '. To fund your stellar account, use the button below.',
        dismissible: false
    };

    createAccountHelpAlertConfig = {
        type: 'info',
        message: '',
        dismissible: false
    };

    generateKeypair() {
        this.newKeypair = StellarSdk.Keypair.random();
        this.newPublicKey = this.newKeypair.publicKey();
        this.newSecret = this.newKeypair.secret();
    }

    @computedFrom('newSecret')
    get hiddenNewSecret() {
        return this.newSecret ? this.newSecret.split('').map(l => 'x').join('') : '';
    }
}
