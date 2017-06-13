/**
 * Created by istrauss on 3/17/2017.
 */

import toml from 'toml';
import _find from 'lodash.find';
import {inject, bindable, bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {ValidationManager, StellarServer} from 'global-resources';
import {AssetResource} from 'app-resources';
import Config from './asset-config';

@inject(Config, HttpClient, ValidationManager, StellarServer, AssetResource)
export class AssetCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) issuer;
    @bindable({defaultBindingMode: bindingMode.twoWay}) code;

    loading = 0;
    info = '';
    issuers = [];

    constructor(config, httpClient, validationManager, stellarServer, assetResource) {
        this.config = config;
        this.httpClient = httpClient;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
        this.assetResource = assetResource;
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
    }

    async codeChanged() {
        this.codes = this.code ? [{
            value: this.code,
            label: this.code
        }] : [];

        if (!this.code) {
            this.issuers = [];
            return;
        }

        this.loading++;

        this.issuers = await this.assetResource.codeIssuers(this.code);

        const issuer = _find(this.issuers, {accountid: this.issuer});

        if (!issuer) {
            this.issuer = null;
        }

        if (this.issuer) {
            this.issuerToml();
        }

        this.loading--;
    }

    issuerChanged() {
        this.issuerToml();
        //this.validateCodeIssuerCombo();
    }

    async issuerToml() {
        if (!this.issuer || this.issuers.length === 0) {
            return;
        }

        const issuer = _find(this.issuers, {accountid: this.issuer});

        if (!issuer.homedomain) {
            this.verified = false;
            return;
        }

        this.loading++;

        try {
            const host = issuer.homedomain.indexOf('http') > -1 ? issuer.homedomain : 'http://' + issuer.homedomain;
            const tomlResponse = await this.httpClient.fetch(host + '/.well-known/stellar.toml');
            const tomlString = await tomlResponse.blob()
                .then(blob => {
                    return new Promise((resolve, reject) => {
                        var reader = new window.FileReader();
                        reader.readAsText(blob);
                        reader.onloadend = function () {
                            resolve(reader.result);
                        };
                    });
                });

            const tomlObj = toml.parse(tomlString);
            this.verified = !!_find(tomlObj.CURRENCIES, currency => currency.issuer === this.issuer && currency.code === this.code);
        }
        catch(e) {
            this.verified = false;
        }

        this.loading--;
    }

    //async validateCodeIssuerCombo() {
    //    if (this.issuer && this.code) {
    //        this.loading++;
    //        try {
    //            this.orderbook = await this.stellarServer.orderbook(
    //                new this.stellarServer.sdk.Asset(this.code, this.issuer),
    //                this.stellarServer.sdk.Asset.native()
    //            );
    //            this.loading--;
    //        }
    //        catch (e) {
    //            this.infoClass = 'error';
    //            this.info = 'Sorry, it looks like that issuer does not exist or that issuer has not issued an asset with that code.';
    //            this.loading--;
    //        }
    //    }
    //}

    validate() {
        return this.validationManager.validate();
    }

    get issuerHomeDomain() {
        const issuer = _find(this.issuers, {accountid: this.issuer});
        return issuer ? issuer.homedomain : '';
    }
}
