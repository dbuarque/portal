import {computedFrom, bindable, bindingMode} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';

export class GenerateNewKeypairCustomElement {
    @computedFrom('secret')
    get hiddenSecret() {
        return this.secret ? this.secret.split('').map(l => 'X').join('') : '';
    }

    @bindable({defaultBindingMode: bindingMode.twoWay})
    publicKey;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    canProceed;

    displaySecret = false;

    generateKeypair() {
        const newKeypair = StellarSdk.Keypair.random();
        this.publicKey = newKeypair.publicKey();
        this.secret = newKeypair.secret();
    }
}
