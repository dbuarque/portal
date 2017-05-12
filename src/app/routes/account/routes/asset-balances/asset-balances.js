/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import Config from './asset-balances-config';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Config, AppStore, AppActionCreators)
export class AssetBalances {

    constructor(config, appStore, appActionCreators) {
        this.config = config;
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;

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
        this.account = state.account;
    }

    refresh() {
        this.appStore.dispatch(this.appActionCreators.updateAccount());
    }

    get refreshing() {
        return this.account.updating;
    }

    updateTableConfig() {
        let vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn accent btn-small btn-flat" type="button"><i class="fa fa-paper-plane-o"></i>&nbsp;Pay</button>')
                .click(() => {
                    vm.router.navigateToRoute('effect-history', {operationId: rowData.id}); //rowData.transactionTypeName.toLowerCase()
                })
                .appendTo(cell);
        };
    }
}
