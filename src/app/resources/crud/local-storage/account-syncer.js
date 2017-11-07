/**
 * Created by Ishai on 4/28/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {UpdateAccountActionCreator} from '../../../action-creators';

@inject(UpdateAccountActionCreator)
export class AccountSyncer {

    @connected('myAccount.accountId')
    accountId;

    constructor(updateAccount) {
        this.updateAccount = updateAccount;

        window.addEventListener('storage', this.syncToStore.bind(this));
        this.syncToStore();
        this.bind();
    }

    async syncToStore(e) {
        const localAccountId = localStorage.getItem('account-id');

        if (this.accountId !== localAccountId) {
            await this.updateAccount.dispatch(localAccountId);
        }
    }

    accountIdChanged() {
        const localAccountId = localStorage.getItem('account-id');

        if (this.accountId !== localAccountId) {
            this.accountId ? localStorage.setItem('account-id', this.accountId) : localStorage.removeItem('account-id');
        }
    }
}
