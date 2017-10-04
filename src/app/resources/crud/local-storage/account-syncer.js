/**
 * Created by Ishai on 4/28/2017.
 */

import _throttle from 'lodash/throttle';
import {inject} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {AppActionCreators} from '../../../app-action-creators';

@inject(Store, AppActionCreators)
export class AccountSyncer {

    @connected('myAccount.accountId')
    accountId;

    constructor(store, appActionCreators) {
        this.store = store;
        this.appActionCreators = appActionCreators;

        window.addEventListener('storage', this.syncToStore.bind(this));
        this.syncToStore();
        this.bind();
    }

    async syncToStore(e) {
        const localAccountId = localStorage.getItem('account-id');

        if (this.accountId !== localAccountId) {
            await this.store.dispatch(this.appActionCreators.updateAccount(localAccountId));
        }
    }

    accountIdChanged() {
        const localAccountId = localStorage.getItem('account-id');

        if (this.accountId !== localAccountId) {
            this.accountId ? localStorage.setItem('account-id', this.accountId) : localStorage.removeItem('account-id');
        }
    }
}
