/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {PaymentService} from 'app-resources';
import Config from './asset-balances-config';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Config, AppStore, PaymentService, AppActionCreators)
export class AssetBalances {

    constructor(config, appStore, paymentService, appActionCreators) {
        this.config = config;
        this.appStore = appStore;
        this.paymentService = paymentService;
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
                    vm.paymentService.initiatePayment({
                        code: rowData.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode : rowData.asset_code,
                        issuer: rowData.asset_issuer,
                        lockCode: true,
                        lockIssuer: true
                    })
                        .catch(e => {});
                })
                .appendTo(cell);
        };
    }
}
