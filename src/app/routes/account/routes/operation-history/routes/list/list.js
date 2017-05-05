/**
 * Created by Ishai on 5/5/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {StellarServer, AppStore} from 'global-resources';
import Config from './list-config';

@inject(Config, Router, StellarServer, AppStore)
export class List {

    loading = 0;

    constructor(config, router, stellarServer, appStore) {
        this.config = config;
        this.router = router;
        this.stellarServer = stellarServer;
        this.appStore = appStore;

        this.updateTableConfig();
    }

    activate() {
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

    refresh() {
        this.operationCallBuilder = this.account ? this.stellarServer.operations().order('desc').forAccount(this.account.id) : undefined;
    }

    get refreshing() {
        return this.jqdt.processing;
    }

    updateTableConfig() {
        let vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn accent btn-flat" type="button">Effects</button>')
                .click(() => {
                    vm.router.navigateToRoute('detail', {operationId: rowData.id}); //rowData.transactionTypeName.toLowerCase()
                })
                .appendTo(cell);
        };
    }
}
