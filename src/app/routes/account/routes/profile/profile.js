/**
 * Created by Ishai on 5/2/2017.
 */

import {inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {Store, connected} from 'aurelia-redux-connect';
import {TransactionService} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(Store, TransactionService, UpdateAccountActionCreator)
export class Profile {
    @connected('myAccount')
    account;

    loading = 0;

    editingProps = {};

    get refreshing() {
        return this.loading > 0;
    }

    constructor(store, transactionService, updateAccount) {
        this.store = store;
        this.transactionService = transactionService;
        this.updateAccount = updateAccount;
    }

    async refresh() {
        this.loading++;

        await this.updateAccount.dispatch(this.account.accountId, {
            force: true
        });

        this.accountData.refresh();

        this.loading--;
    }

    editProperty(prop) {
        this[prop + 'New'] = this.account[prop];
        this.editingProps[prop] = true;
    }

    cancelProperty(prop) {
        this.editingProps[prop] = false;
    }

    async saveProperty(prop) {
        try {
            await this.transactionService.submit([
                StellarSdk.Operation.setOptions({
                    [prop]: this[prop + 'New']
                })
            ]);

            await this.updateAccount.dispatch(this.account.accountId, {
                force: true
            });

            this.editingProps[prop] = false;
        }
        catch (e) {}
    }
}
