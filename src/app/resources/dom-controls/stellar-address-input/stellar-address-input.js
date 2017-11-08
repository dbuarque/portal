/**
 * Created by istrauss on 6/22/2017.
 */

import {inject, bindable, bindingMode, computedFrom} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class StellarAddressInputCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) publicKey;
    @bindable({defaultBindingMode: bindingMode.twoWay}) federatedAddress;
    @bindable({defaultBindingMode: bindingMode.twoWay}) memoType;
    @bindable({defaultBindingMode: bindingMode.twoWay}) memo;
    
    @computedFrom('intermediateValue', 'federatedAddress', 'publicKey')
    get inputValue() {
        return this.intermediateValue || this.federatedAddress || this.publicKey;
    }    
    set inputValue(newValue) {
        //We already processed this value, just return
        if (newValue === this.federatedAddress || newValue === this.publicKey) {
            return;
        }

        this.intermediateValue = newValue;
        this.federatedAddress = undefined;
        this.publicKey = undefined;
        this.memo = undefined;
        this.memoType = undefined;

        this.loading++;
        this.numCalls++;
        const callNum = this.numCalls;

        this.stellarServer.sdk.FederationServer.resolve(newValue)
            .then(response => {
                if (callNum !== this.numCalls) {
                    this.loading--;
                    return;
                }

                this.intermediateValue = undefined;
                this.publicKey = response.account_id;
                this.federatedAddress = newValue !== this.publicKey ? newValue : undefined;
                this.memoType = response.memo_type;
                this.memo = response.memo;
            })
            .catch(e => {});

        this.loading--;
    }

    loading = 0;
    numCalls = 0;

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }
}
