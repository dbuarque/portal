/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer, AppStore} from 'global-resources';
import Config from './open-offers-config';

@inject(Config, StellarServer, AppStore)
export class OpenOffers {

    loading = 0;
    offers = [];

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

        this.page = undefined;
        await this.getMoreOffers();

        this.loading--;
    }

    async getMoreOffers() {
        this.page = this.page ? await this.page.next() : await this.stellarServer.offers('accounts', this.account.id).limit(100).call();
        this.offers = this.offers.concat(this.page.records);

        if (this.page.records === 100) {
            return this.getMoreOffers();
        }
    }

    get refreshing() {
        return this.account.updating || this.loading > 0;
    }
}
