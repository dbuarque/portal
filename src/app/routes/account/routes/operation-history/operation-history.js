/**
 * Created by Ishai on 5/2/2017.
 */


import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store} from 'au-redux';
import {StellarServer} from 'global-resources';
import {OperationResource} from 'app-resources';
import Config from './operation-history-config';

@inject(Config, Router, StellarServer, Store, OperationResource)
export class OperationHistory {

    loading = 0;
    additionalFilterParams = {};

    constructor(config, router, stellarServer, store, operationResource) {
        this.config = config;
        this.router = router;
        this.stellarServer = stellarServer;
        this.store = store;
        this.operationResource = operationResource;

        this.updateTableConfig();
    }

    activate(params) {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();

        const oldAccountId = this.account ? this.account.accountId : undefined;

        this.account = state.account;

        if (this.account.accountId !== oldAccountId) {
            this.additionalFilterParams.sourceAccount = this.account.accountId;
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
            $('<button class="btn accent btn-flat btn-small" type="button"><i class="fa fa-share-alt"></i>&nbsp;Effects</button>')
                .click(() => {
                    vm.router.navigateToRoute('effect-history', {operationId: rowData.id}); //rowData.transactionTypeName.toLowerCase()
                })
                .appendTo(cell);
        };
    }
}
