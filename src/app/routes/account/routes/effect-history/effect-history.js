/**
 * Created by Ishai on 9/24/2017.
 */


import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {AccountResource} from 'app-resources';
import Config from './effect-history-config';

@inject(Config, AccountResource)
export class EffectHistory {

    @connected('myAccount')
    account;

    loading = 0;

    get refreshing() {
        return this.loading > 0;
    }

    get tableConfig() {
        return {
            ...this.config.table,
            ajax: this.ajax.bind(this)
        };
    }

    constructor(config, accountResource) {
        this.config = config;
        this.accountResource = accountResource;
    }

    refresh() {
        if (this.dataTable) {
            this.dataTable.dataTable.api().ajax.reload();
        }
    }

    async ajax(data, callback, settings) {
        this.loading++;

        const tableData = await this.accountResource.effectsDataTable(this.account.accountId, data, settings);

        callback(tableData);

        this.loading--;
    }
}
