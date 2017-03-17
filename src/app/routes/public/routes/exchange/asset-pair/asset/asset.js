/**
 * Created by istrauss on 3/17/2017.
 */

import _find from 'lodash/find';
import {inject, bindable} from 'aurelia-framework';
import {ValidationManger, StellarServer} from 'utils';
import {defaultAssets} from './default-assets';
import Config from './asset-config';

@inject(Config, ValidationManger, StellarServer)
export class Asset {

    @bindable issuer;
    @bindable code;

    loading = 0;
    info = '';

    constructor(config, validationManger, stellarServer) {
        this.config = config;
        this.validationManger = validationManger;
        this.stellarServer = stellarServer;
        this.defaultAssets = defaultAssets;
    }

    codeChanged() {
        const defaultAsset = _find(this.defaultAssets, {code: this.code});

        this.issuer = defaultAsset ? defaultAsset.issuers[0] : undefined;
    }

    async issuerChanged() {
        if (this.issuer) {
            this.loading ++;
            this.accountPromise = stellarServer.accounts.accountId(this.issuer);
            this.loading --;
        }
    }

    validate() {
        return this.validationManger.validate();
    }
}
