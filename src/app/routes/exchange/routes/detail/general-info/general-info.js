/**
 * Created by istrauss on 6/20/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {MarketResource} from 'app-resources';

@inject(AppStore, MarketResource)
export class GeneralInfoCustomElement {

    loading = 0;

    constructor(appStore, marketResource) {
        this.appStore = appStore;
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

        this.loading++;

        this.market = await this.marketResource.findOne(
            this.assetPair.selling.code,
            this.assetPair.selling.issuer,
            this.assetPair.buying.code,
            this.assetPair.buying.issuer
        );

        this.loading--;
    }
}