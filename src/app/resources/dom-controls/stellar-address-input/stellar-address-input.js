/**
 * Created by istrauss on 6/22/2017.
 */

import _debounce from 'lodash/debounce';
import {inject, bindable, bindingMode} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class StellarAddressInputCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) publicKey;
    @bindable({defaultBindingMode: bindingMode.twoWay}) federatedAddress;
    @bindable({defaultBindingMode: bindingMode.twoWay}) memoType;
    @bindable({defaultBindingMode: bindingMode.twoWay}) memo;

    loading = 0;
    numProcesses = 0;

    constructor(stellarServer) {
        this.stellarServer = stellarServer;

        this.onChange = _debounce(this.processInput.bind(this), 350);
    }

    async processInput() {
        //We already processed this value, just return
        if (this.inputValue === this.federatedAddress || this.inputValue === this.publicKey) {
            return;
        }

        this.loading++;

        this.numProcesses++;
        let processNum = this.numProcesses;

        let federatedAddress = undefined;
        let publicKey = undefined;
        let memo = undefined;
        let memoType = undefined;

        try {
            const response = await this.stellarServer.sdk.FederationServer.resolve(this.inputValue);

            if (processNum !== this.numProcesses) {
                this.loading--;
                return;
            }

            publicKey = response.account_id;
            federatedAddress = this.inputValue !== publicKey ? this.inputValue : undefined;
            memoType = response.memo_type;
            memo = response.memo;
        }
        catch(e) {}

        Object.assign(this, {
            federatedAddress,
            publicKey,
            memoType,
            memo
        });

        this.loading--;
    }
}
