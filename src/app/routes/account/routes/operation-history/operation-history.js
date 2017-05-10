/**
 * Created by Ishai on 5/2/2017.
 */


import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {StellarServer, AppStore} from 'global-resources';
import {OperationResource} from 'app-resources';
import Config from './operation-history-config';

@inject(Config, Router, StellarServer, AppStore, OperationResource)
export class OperationHistory {

    loading = 0;
    additionalFilterParams = {};

    constructor(config, router, stellarServer, appStore, operationResource) {
        this.config = config;
        this.router = router;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.operationResource = operationResource;

        this.updateTableConfig();
    }

    activate(params) {
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
            this.additionalFilterParams.sourceAccount = this.account.id;
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

    updateTableConfig() {
        let vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn accent btn-flat" type="button">Effects</button>')
                .click(() => {
                    vm.router.navigateToRoute('effect-history', {operationId: rowData.id}); //rowData.transactionTypeName.toLowerCase()
                })
                .appendTo(cell);
        };
    }
}
