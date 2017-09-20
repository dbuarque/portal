/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {connected} from 'au-redux';
import {AccountResource, TrustService} from 'app-resources';
import Config from './asset-balances-config';

@inject(Config, Router, AccountResource, TrustService)
export class AssetBalances {

    @connected('myAccount')
    account;

    loading = 0;

    get refreshing() {
        return this.loading > 0;
    }

    get tableConfig() {
        const vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            if (rowData.asset_type === 'native') {
                return;
            }

            cell.empty();

            const data = $('<span style="margin-right: 10px;">' + rowData.trustLimit + '</span>');
            const modify = $('<a href="javascript:void(0)" class="primary-text">modify</a>&nbsp;')
                .click(e => {
                    vm.trustService.modifyLimit(rowData.assetCode, rowData.issuerId)
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
                        code: rowData.assetType === 'native' ? window.lupoex.stellar.nativeAssetCode : rowData.assetCode,
                        issuer: rowData.issuerId
                    });
                })
                .appendTo(cell);
        };

        return {
            ...vm.config.table,
            ajax: vm.ajax.bind(vm)
        };
    }

    constructor(config, router, accountResource, trustService) {
        this.config = config;
        this.router = router;
        this.accountResource = accountResource;
        this.trustService = trustService;
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
    }

    refresh() {
        if (this.dataTable) {
            this.dataTable.dataTable.api().ajax.reload();
        }
    }

    async ajax(data, callback, settings) {
        this.loading++;

        const tableData = await this.accountResource.trustlinesDataTable(this.account.accountId, data, settings);

        callback(tableData);

        this.loading--;
    }
}
