/**
 * Created by Ishai on 5/2/2017.
 */

import {inject} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(Store, UpdateAccountActionCreator)
export class Profile {
    @connected('myAccount')
    account;

    loading = 0;

    get refreshing() {
        return this.loading > 0;
    }

    constructor(store, updateAccount) {
        this.store = store;
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
}
