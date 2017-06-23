/**
 * Created by istrauss on 6/20/2017.
 */

import _find from 'lodash.find';
import {inject} from 'aurelia-framework';
import {AppStore, StellarServer} from 'global-resources';
import {MarketResource} from 'app-resources';

@inject(AppStore, StellarServer, MarketResource)
export class GeneralInfoCustomElement {

    loading = 0;

    constructor(appStore, stellarServer, marketResource) {
        this.appStore = appStore;
        this.stellarServer = stellarServer;
        this.marketResource = marketResource;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.appStore.getState();

        if (this.assetPair !== state.exchange.assetPair) {
            this.assetPair = state.exchange.assetPair;
            this.refresh();
        }
    }

    async refresh() {
        if (!this.assetPair) {
            return;
        }

        this.findMarket();

        this.sellingAssetVerified = this.assetPair.selling.code !== window.lupoex.stellar.nativeAssetCode ?
            await this.verifyAsset(this.assetPair.selling) :
            true;

        this.buyingAssetVerified = this.assetPair.buying.code !== window.lupoex.stellar.nativeAssetCode ?
            await this.verifyAsset(this.assetPair.buying) :
            true;
    }

    async findMarket() {
        this.loading++;

        this.market = await this.marketResource.findOne(
            this.assetPair.selling.code,
            this.assetPair.selling.issuer,
            this.assetPair.buying.code,
            this.assetPair.buying.issuer
        );

        this.loading--;
    }

    async verifyAsset(asset) {
        this.loading++;

        const issuer =  this.stellarServer.loadAccount(asset.issuer);
        let verified;

        try {
            const tomlObj = await this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.home_domain);
            verified = !!_find(tomlObj.CURRENCIES, currency => currency.issuer === this.issuer && currency.code === this.code);
        }
        catch(e) {
            verified = false;
        }

        this.loading--;

        return verified;
    }
}