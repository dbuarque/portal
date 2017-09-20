/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer} from 'global-resources';
import {EffectResource} from 'app-resources';
import Config from './effect-history-config';

@inject(Config, StellarServer, Store, EffectResource)
export class EffectHistory {

    loading = 0;
    additionalFilterParams = {};

    constructor(config, stellarServer, store, effectResource) {
        this.config = config;
        this.stellarServer = stellarServer;
        this.store = store;
        this.effectResource = effectResource;
    }

    activate(params) {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();

        if (params.operationId) {
            this.additionalFilterParams['operation.id'] = params.operationId;
        }
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();

        const oldAccountId = this.account ? this.account.accountId : undefined;

        this.account = state.myAccount;

        if (this.account.accountId !== oldAccountId) {
            this.additionalFilterParams['historyAccount.address'] = this.account.accountId;
            this.refresh();
        }
    }

    refresh() {
        if (this.jqdt) {
            this.jqdt.refresh();
        }
    }

    get refreshing() {
        return this.jqdt.processing;
    }
}
