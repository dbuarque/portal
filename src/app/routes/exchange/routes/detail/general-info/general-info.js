/**
 * Created by istrauss on 6/20/2017.
 */

import _find from 'lodash.find';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store} from 'au-redux';
import {StellarServer} from 'global-resources';
import {MarketResource} from 'app-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Router, Store, StellarServer, MarketResource, ExchangeActionCreators)
export class GeneralInfoCustomElement {

    loading = 0;

    constructor(router, store, stellarServer, marketResource, exchangeActionCreators) {
        this.router = router;
        this.store = store;
        this.stellarServer = stellarServer;
        this.marketResource = marketResource;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();

        if (this.assetPair !== state.exchange.assetPair) {
            this.assetPair = state.exchange.assetPair;
            this.refresh();
        }
    }

    invert() {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.router.navigateToRoute('detail', {
            buyingCode: this.assetPair.selling.code,
            buyingIssuer: this.assetPair.selling.code === nativeAssetCode ? 'native': this.assetPair.selling.issuer,
            sellingCode: this.assetPair.buying.code,
            sellingIssuer: this.assetPair.buying.code === nativeAssetCode ? 'native': this.assetPair.buying.issuer
        });
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

        const issuer = await this.stellarServer.loadAccount(asset.issuer);
        let verified;

        if (!issuer.home_domain) {
            verified = false;
        }
        else {
            try {
                const tomlObj = await this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.home_domain);
                verified = !!_find(tomlObj.CURRENCIES, currency => currency.issuer === asset.issuer && currency.code === asset.code);
            }
            catch(e) {
                verified = false;
            }
        }

        this.loading--;

        return verified;
    }
}
