/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer, AppStore} from 'global-resources';
import Config from './open-offers-config';

@inject(Config, StellarServer, AppStore)
export class OpenOffersCustomElement {

    loading = 0;

    constructor(config, stellarServer, appStore) {
        this.config = config;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
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

        const oldAccountId = this.account ? this.account.id : undefined;

        this.account = state.account;

        if (this.account.id !== oldAccountId) {
            this.refresh();
        }
    }

    async refresh() {
        this.loading++;

        this.offersResult = await this.stellarServer.offers('accounts', this.account.id)
            .call();

        this.offers = this.offersResult.records;

        this.loading--;
    }
}
