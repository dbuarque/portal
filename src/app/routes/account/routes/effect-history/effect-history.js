/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer, AppStore} from 'global-resources';
import {EffectResource} from 'app-resources';
import Config from './effect-history-config';

@inject(Config, StellarServer, AppStore, EffectResource)
export class EffectHistory {

    loading = 0;
    additionalFilterParams = {};

    constructor(config, stellarServer, appStore, effectResource) {
        this.config = config;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.effectResource = effectResource;
    }

    activate(params) {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();

        if (params.operationId) {
            this.additionalFilterParams['operation.id'] = params.operationId;
        }
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.appStore.getState();

        const oldAccountId = this.account ? this.account.id : undefined;

        this.account = state.account;

        if (this.account.id !== oldAccountId) {
            this.additionalFilterParams['historyAccount.address'] = this.account.id;
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
