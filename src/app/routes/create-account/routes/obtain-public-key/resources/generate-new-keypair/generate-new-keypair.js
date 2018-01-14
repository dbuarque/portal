import {computedFrom, bindable} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';

export class GenerateNewKeypairCustomElement {
    @computedFrom('newSecret')
    get hiddenNewSecret() {
        return this.secret ? this.secret.split('').map(l => 'x').join('') : '';
    }

    @bindable()
    publicKey;

    @bindable()
    canProceed;

    generateKeypair() {
        this.newKeypair = StellarSdk.Keypair.random();
        this.publicKey = this.newKeypair.publicKey();
        this.secret = this.newKeypair.secret();
    }
}
