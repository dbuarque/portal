/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {Router} from 'aurelia-router';
import {connected} from 'au-redux';
import {AccountResource, TrustService} from 'app-resources';
import Config from './asset-balances-config';

@inject(Config, SanitizeHTMLValueConverter, Router, AccountResource, TrustService)
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

            const data = $('<span style="margin-right: 10px;">' + this.sanitizeHTML.toView(rowData.trustLimit) + '</span>');
            const modify = $('<a href="javascript:void(0)" class="primary-text">modify</a>&nbsp;')
                .click(async () => {
                    try {
                        await vm.trustService.modifyLimit(rowData.assetType, rowData.assetCode, rowData.issuerId);
                    }
                    catch(e) {}

                    vm.refresh();
                });

            data.appendTo(cell);
            modify.appendTo(cell);
        };

        vm.config.table.columns[4].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn accent btn-small btn-flat" type="button"><i class="fa fa-paper-plane-o"></i>&nbsp;Pay</button>')
                .click(() => {
                    vm.goToSendPayment(rowData);
                })
                .appendTo(cell);
        };

        return {
            ...vm.config.table,
            ajax: vm.ajax.bind(vm)
        };
    }

    goToSendPayment(balance) {
        const isNative = balance.assetType.toLowerCase() === 'native';
        this.router.parent.navigateToRoute('send-payment', {
            type: balance.assetType,
            code: isNative ? window.lupoex.stellar.nativeAssetCode : balance.assetCode,
            issuer: isNative ? 'Stellar' : balance.issuerId
        });
    }

    constructor(config, sanitizeHTML, router, accountResource, trustService) {
        this.config = config;
        this.sanitizeHTML = sanitizeHTML;
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
