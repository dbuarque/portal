/**
 * Created by Ishai on 5/5/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {StellarServer, AppStore} from 'global-resources';
import Config from './detail-config';

@inject(Config, Router, StellarServer, AppStore)
export class TransactionCustomElement {

    loading = 0;

    constructor(config, router, stellarServer, appStore) {
        this.config = config;
        this.router = router;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
    }

    activate(params) {
        this.operationId = params.operationId;
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    attached() {
        this.updateRouteTitle();
    }

    updateFromStore() {
        const state = this.appStore.getState();

        const oldAccountId = this.account ? this.account.id : undefined;

        this.account = state.account;

        if (this.account.id !== oldAccountId) {
            this.refresh();
        }
    }

    updateRouteTitle() {
        this.router.currentInstruction.config.title = 'Operation #' + this.operationId + ' Effects';
    }

    refresh() {
        this.effectCallBuilder = this.account ? this.stellarServer.effects().order('desc').forOperation(this.operationId) : undefined;
    }

    get refreshing() {
        return this.jqdt.processing;
    }
}