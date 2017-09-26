/**
 * Created by Ishai on 4/30/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {AccountResource, OfferService} from 'app-resources';
import Config from './open-offers-config';

@inject(Config, AccountResource, OfferService)
export class OpenOffers {

    @connected('myAccount')
    account;

    loading = 0;

    get refreshing() {
        return this.loading > 0;
    }

    get tableConfig() {
        const vm = this;

        vm.config.table.columns[6].cellCallback = (cell, rowData) => {
            cell.empty();
            $('<button class="btn error-text btn-small btn-flat" type="button">Cancel</button>')
                .click(() => {
                    vm.offerService.cancelOffer(rowData);
                })
                .appendTo(cell);
        };

        return {
            ...vm.config.table,
            ajax: vm.ajax.bind(vm)
        };
    }

    constructor(config, accountResource, offerService) {
        this.config = config;
        this.accountResource = accountResource;
        this.offerService = offerService;
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
    }

    refresh() {
        if (this.dataTable) {
            this.dataTable.dataTable.api().ajax.reload();
        }
    }

    async ajax(data, callback, settings) {
        this.loading++;

        const tableData = await this.accountResource.offersDataTable(this.account.accountId, data, settings);

        callback(tableData);

        this.loading--;
    }
}
