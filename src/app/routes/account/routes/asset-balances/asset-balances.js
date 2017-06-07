/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {TrustService} from 'app-resources';
import Config from './asset-balances-config';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Config, Router, AppStore, TrustService, AppActionCreators)
export class AssetBalances {

    constructor(config, router, appStore, trustService, appActionCreators) {
        this.config = config;
        this.router = router;
        this.appStore = appStore;
        this.trustService = trustService;
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
            if (rowData.asset_type === 'native') {
                return;
            }

            cell.empty();

            const data = $('<span style="margin-right: 10px;">' + rowData.limit + '</span>');
            const modify = $('<a href="javascript:void(0)" class="primary-text">modify</a>&nbsp;')
                .click(e => {
                    vm.trustService.modifyLimit(rowData.asset_code, rowData.asset_issuer)
                        .then(vm.refresh.bind(vm))
                        .catch(e => {});
                });

            data.appendTo(cell);
            modify.appendTo(cell);
        };

        vm.config.table.columns[4].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn accent btn-small btn-flat" type="button"><i class="fa fa-paper-plane-o"></i>&nbsp;Pay</button>')
                .click(() => {
                    vm.router.parent.navigateToRoute('send-payment', {
                        code: rowData.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode : rowData.asset_code,
                        issuer: rowData.asset_issuer
                    });
                })
                .appendTo(cell);
        };
    }
}
