/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, computedFrom} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {Router} from 'aurelia-router';
import {connected} from 'aurelia-redux-connect';
import {AccountResource, TrustService} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../../action-creators';
import {AssetBalancesConfig} from './asset-balances.config';

@inject(AssetBalancesConfig, SanitizeHTMLValueConverter, Router, AccountResource, TrustService, UpdateAccountActionCreator)
export class AssetBalances {
    @connected('myAccount')
    account;

    loading = 0;

    @computedFrom('loading')
    get refreshing() {
        return this.loading > 0;
    }

    @computedFrom('config')
    get tableConfig() {
        const vm = this;

        vm.config.table.columns[3].cellCallback = (cell, rowData) => {
            if (rowData.asset_type === 'native') {
                return;
            }

            cell.empty();

            const data = $('<span style="margin-right: 10px;">' + this.sanitizeHTML.toView(rowData.trustLimit) + '</span>');
            const modify = $('<a href="javascript:void(0)" class="primary-text">modify</a>&nbsp;')
                .click(async() => {
                    try {
                        await vm.trustService.modifyLimit(rowData.assetType, rowData.assetCode, rowData.issuerId);
                    }
                    catch (e) {}

                    vm.refresh();
                });

            data.appendTo(cell);
            modify.appendTo(cell);
        };

        vm.config.table.columns[4].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn dark-gray btn-small btn-flat" type="button"><i class="fal fa-paper-plane"></i>&nbsp;Pay</button>')
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
            code: isNative ? window.stellarport.stellar.nativeAssetCode : balance.assetCode,
            issuer: isNative ? 'Stellar' : balance.issuerId
        });
    }

    constructor(config, sanitizeHTML, router, accountResource, trustService, updateAccount) {
        this.config = config;
        this.sanitizeHTML = sanitizeHTML;
        this.router = router;
        this.accountResource = accountResource;
        this.trustService = trustService;
        this.updateAccount = updateAccount;
        this.nativeAssetCode = window.stellarport.stellar.nativeAssetCode;
    }

    bind() {
        this.updateAccount.dispatch(this.account.accountId, {
            force: true
        });
    }

    refresh() {
        this.updateAccount.dispatch(this.account.accountId, {
            force: true
        });

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
