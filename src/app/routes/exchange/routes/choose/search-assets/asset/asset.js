/**
 * Created by istrauss on 3/17/2017.
 */

import _find from 'lodash/find';
import {inject, bindable, bindingMode, computedFrom} from 'aurelia-framework';
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

        if (!issuer) {
            return;
        }

        if (!issuer.homedomain) {
            this.verified = false;
            return;
        }

        this.loading++;

        try {
            const tomlObj = await this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.homedomain);
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

    @computedFrom('issuer')
    get issuerHomeDomain() {
        const issuer = _find(this.issuers, {accountid: this.issuer});
        return issuer ? issuer.homedomain : '';
    }

    @computedFrom('issuer', 'issuers')
    get verifiedExplanation() {
        return 'This asset code/issuer combination was verified by the owner of ' + this.issuerHomeDomain;
    }

    @computedFrom('issuerHomeDomain')
    get notVerifiedExplanation() {
        return this.issuerHomeDomain ?
            'Anyone can publish an asset claiming to be from any domain on the stellar network. The owner of ' + this.issuerHomeDomain +
            ' has not verified this asset code/issuer combination. Use caution when trading this asset.' :
            'There is no verifiable issuing home domain included with this asset.';
    }
}
