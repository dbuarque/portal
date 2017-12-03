/**
 * Created by Ishai on 9/24/2017.
 */


import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountResource} from 'app-resources';
import {EffectHistoryConfig} from './effect-history.config';

@inject(EffectHistoryConfig, AccountResource)
export class EffectHistory {

    @connected('myAccount')
    account;

    loading = 0;

    @computedFrom('loading')
    get refreshing() {
        return this.loading > 0;
    }

    @computedFrom('config')
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
