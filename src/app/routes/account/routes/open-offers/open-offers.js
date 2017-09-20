/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {OfferService} from 'app-resources';
import {AppActionCreators} from '../../../../app-action-creators';
import Config from './open-offers-config';

@inject(Config, Store, OfferService, AppActionCreators)
export class OpenOffers {

    loading = 0;
    offers = [];

    constructor(config, store, offerService, appActionCreators) {
        this.config = config;
        this.store = store;
        this.offerService = offerService;
        this.appActionCreators = appActionCreators;

        this.updateTableConfig();
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

        const oldAccountId = this.account ? this.account.accountId : undefined;

        this.account = state.myAccount;
        this.offers = state.offers;

        if (this.account.accountId !== oldAccountId) {
            this.refresh();
        }
    }

    //async refresh() {
    //    this.loading++;
//
    //    await this.store.dispatch(this.appActionCreators.updateOffers());
//
    //    this.loading--;
    //}

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
