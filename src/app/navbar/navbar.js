/**
 * Created by Ishai on 3/27/2016.
 */
import {bindable, inject, computedFrom} from 'aurelia-framework';
import {Store} from 'au-redux';
import {AlertToaster} from 'global-resources';
import {AppActionCreators} from '../app-action-creators';

@inject(Store, AppActionCreators, AlertToaster)
export class Navbar {
    @bindable router;

    constructor(store, appActionCreators, toaster) {
        this.store = store;
        this.appActionCreators = appActionCreators;
        this.toaster = toaster;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.store.getState();
        this.account = newState.account;
    }

    goToExchange() {
        this.router.navigateToRoute('exchange');
    }

    login() {
        this.router.navigateToRoute('login');
    }

    logout() {
        this.toaster.primary('Logged out successfully.');
        this.store.dispatch(this.appActionCreators.setAccount());
    }

    goToAccount() {
        this.router.navigateToRoute('account');
    }

    @computedFrom('account')
    get firstFive() {
        return this.account && this.account.accountId ? this.account.accountId.slice(0, 5) : null;
    }
}
