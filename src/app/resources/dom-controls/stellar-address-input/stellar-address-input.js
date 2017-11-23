/**
 * Created by istrauss on 6/22/2017.
 */

import {bindable, bindingMode, computedFrom} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';

export class StellarAddressInputCustomElement {

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    publicKey;

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    federatedAddress;

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    memoType;

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    memo;

    @computedFrom('_inputValue', 'federatedAddress', 'publicKey')
    get inputValue() {
        return this._inputValue || this.federatedAddress || this.publicKey;
    }
    set inputValue(newValue) {
        this._inputValue = newValue;

        this.loading++;
        this.numCalls++;
        const callNum = this.numCalls;

        StellarSdk.FederationServer.resolve(newValue || '')
            .then(response => {
                if (callNum !== this.numCalls) {
                    this.loading--;
                    return;
                }

                this._inputValue = undefined;

                const publicKey = response.account_id;
                const federatedAddress = newValue !== this.publicKey ? newValue : undefined;

                if (this.publicKey !== publicKey || this.federatedAddress !== federatedAddress) {
                    this.publicKey = this.resolvedPublicKey = publicKey;
                    this.federatedAddress = federatedAddress;
                    this.memoType = response.memo_type;
                    this.memo = response.memo;
                }

                this.loading--;
            })
            .catch(e => {
                if (callNum !== this.numCalls) {
                    this.loading--;
                    return;
                }

                this.publicKey = undefined;
                this.federatedAddress = undefined;
                this.memo = undefined;
                this.memoType = undefined;

                this.loading--;
            });
    }

    loading = 0;
    numCalls = 0;

    publicKeyChanged() {
        if (this.publicKey !== this.resolvedPublicKey) {
            this.inputValue = this.publicKey;
        }
    }
}
