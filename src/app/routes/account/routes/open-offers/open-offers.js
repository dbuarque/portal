/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {OfferService} from 'app-resources';
import {AppActionCreators} from '../../../../app-action-creators';
import Config from './open-offers-config';

@inject(Config, AppStore, OfferService, AppActionCreators)
export class OpenOffers {

    loading = 0;
    offers = [];

    constructor(config, appStore, offerService, appActionCreators) {
        this.config = config;
        this.appStore = appStore;
        this.offerService = offerService;
        this.appActionCreators = appActionCreators;

        this.updateTableConfig();
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
        this.offers = state.offers;

        if (this.account.id !== oldAccountId) {
            this.refresh();
        }
    }

    async refresh() {
        this.loading++;

        this.appStore.dispatch(this.appActionCreators.updateOffers());

        this.loading--;
    }

    get refreshing() {
        return this.account.updating || this.loading > 0;
    }

    updateTableConfig() {
        let vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn error-text btn-small btn-flat" type="button">Cancel</button>')
                .click(() => {
                    vm.offerService.cancelOffer(rowData);
                })
                .appendTo(cell);
        };
    }
}
