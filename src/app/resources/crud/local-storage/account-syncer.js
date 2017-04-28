/**
 * Created by Ishai on 4/28/2017.
 */

import _throttle from 'lodash/throttle';
import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {AppActionCreators} from '../../../app-action-creators';

@inject(AppStore, AppActionCreators)
export class AccountSyncer {

    constructor(appStore, appActionCreators) {
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
        this.syncToLocalStorage = _throttle(this._syncToLocalStorage.bind(this), 1000);
    }

    init() {
        this.syncToStore();
        window.addEventListener('storage', this.syncToStore.bind(this));
        this.appStore.subscribe(this.syncToLocalStorage.bind(this));
    }

    syncToStore() {
        const localAccountId = localStorage.getItem('account-id');
        const storedAccount = this.appStore.getState().account;
        const storedAccountId = storedAccount ? storedAccount.id : undefined;

        if (storedAccountId !== localAccountId) {
            this.appStore.dispatch(this.appActionCreators.setAccount(localAccountId));
        }
    }

    _syncToLocalStorage() {
        const localAccountId = localStorage.getItem('account-id');
        const storedAccount = this.appStore.getState().account;
        const storedAccountId = storedAccount ? storedAccount.id : undefined;

        if (storedAccountId !== localAccountId) {
            storedAccountId ? localStorage.setItem('account-id', storedAccountId) : localStorage.removeItem('account-id');
        }
    }
}