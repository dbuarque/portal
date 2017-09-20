/**
 * Created by Ishai on 4/28/2017.
 */

import _throttle from 'lodash.throttle';
import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {AppActionCreators} from '../../../app-action-creators';

@inject(Store, AppActionCreators)
export class AccountSyncer {

    constructor(store, appActionCreators) {
        this.store = store;
        this.appActionCreators = appActionCreators;
        this.syncToLocalStorage = _throttle(this._syncToLocalStorage.bind(this), 1000);
    }

    async init() {
        if (this.initialized) {
            return;
        }

        window.addEventListener('storage', this.syncToStore.bind(this));
        this.store.subscribe(this.syncToLocalStorage.bind(this));
        await this.syncToStore();

        this.initialized = true;
    }

    async syncToStore() {
        const localAccountId = localStorage.getItem('account-id');
        const storedAccount = this.store.getState().myAccount;
        const storedAccountId = storedAccount ? storedAccount.id : undefined;

        if (storedAccountId !== localAccountId) {
            await this.store.dispatch(this.appActionCreators.updateAccount(localAccountId));
        }
    }

    _syncToLocalStorage() {
        const localAccountId = localStorage.getItem('account-id');
        const storedAccount = this.store.getState().myAccount;
        const storedAccountId = storedAccount ? storedAccount.accountId : undefined;

        if (storedAccountId !== localAccountId) {
            storedAccountId ? localStorage.setItem('account-id', storedAccountId) : localStorage.removeItem('account-id');
        }
    }
}
