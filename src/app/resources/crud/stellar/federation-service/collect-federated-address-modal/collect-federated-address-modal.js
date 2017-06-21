/**
 * Created by istrauss on 6/19/2017.
 */

import _debounce from 'lodash.debounce';
import {inject} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class CollectFederatedAddressModal {

    loading = 0;

    constructor(stellarServer) {
        this.stellarServer = stellarServer;

        this.lookupAddress = _debounce(this._lookupAddress.bind(this), 250);
    }

    activate(params) {
        this.modalVM = params.modalVM;
    }

    async _lookupAddress() {
        this.loading++;



        this.loading--;
    }
}