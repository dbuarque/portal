/**
 * Created by istrauss on 3/17/2017.
 */

import _find from 'lodash/find';
import {inject, bindable, bindingMode} from 'aurelia-framework';
import {ValidationManager, StellarServer} from 'resources';
import {AssetResource} from 'app-resources';
import Config from './asset-config';

@inject(Config, ValidationManager, StellarServer, AssetResource)
export class AssetCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) issuer;
    @bindable({defaultBindingMode: bindingMode.twoWay}) code;

    loading = 0;
    info = '';
    issuers = [];

    constructor(config, validationManager, stellarServer, assetResource) {
        this.config = config;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
        this.assetResource = assetResource;
    }

    async codeChanged() {
        this.issuer = null;

        if (!this.code) {
            this.issuers = [];
            return;
        }

        this.loading++;
        const issuers = await this.assetResource.issuersByCode(this.code);
        this.issuers = issuers.map(i => {
            return {
                value: i,
                label: i
            };
        });

        this.loading--;
    }

    issuerChanged() {
        this.findIssuerAccount();
        this.validateCodeIssuerCombo();
    }

    async findIssuerAccount() {
        if (this.issuer) {
            this.loading++;
            try {
                this.account = await this.stellarServer.accounts().accountId(this.issuer).call();
                this.infoClass = 'info';
                this.info = this.account.home_domain ?
                    'You can find more info on this issuer at: <a target="_blank" href="' + (this.account.home_domain.indexOf('http') > -1 ? '' : 'http://') + this.account.home_domain + '">' + this.account.home_domain + '</a>' :
                    'This issuer does not have a home domain.';
                this.loading--;
            }
            catch(e) {
                this.infoClass = 'error';
                this.info = 'Sorry, we could not find this issuer account. Please check the spelling and try again.';
                this.loading--;
            }
        }
    }

    async validateCodeIssuerCombo() {
        if (this.issuer && this.code) {
            this.loading++;
            try {
                this.orderbook = await this.stellarServer.orderbook(
                    new this.stellarServer.sdk.Asset(this.code, this.issuer),
                    this.stellarServer.sdk.Asset.native()
                );
                this.loading--;
            }
            catch (e) {
                this.infoClass = 'error';
                this.info = 'Sorry, it looks like that issuer does not exist or that issuer has not issued an asset with that code.';
                this.loading--;
            }
        }
    }

    validate() {
        return this.validationManager.validate();
    }
}
