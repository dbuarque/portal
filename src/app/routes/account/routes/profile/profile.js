/**
 * Created by Ishai on 5/2/2017.
 */

import {inject, bindable} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Store, AppActionCreators)
export class Profile {

    constructor(store, appActionCreators) {
        this.store = store;
        this.appActionCreators = appActionCreators;
    }

    activate() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();
        this.account = state.account;
    }

    refresh() {
        this.store.dispatch(this.appActionCreators.updateAccount());
    }

    get refreshing() {
        return this.account.updating;
    }
}