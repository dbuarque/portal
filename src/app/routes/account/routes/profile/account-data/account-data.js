
import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountResource} from 'app-resources';
import {AccountDataConfig} from './account-data.config';

@inject(AccountDataConfig, AccountResource)
export class AccountDataCustomElement {

    @connected('myAccount')
    account;

    loading = 0;

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

        const tableData = await this.accountResource.accountDataDataTable(this.account.accountId, data, settings);

        callback(tableData);

        this.loading--;
    }
}
