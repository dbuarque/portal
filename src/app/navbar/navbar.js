/**
 * Created by Ishai on 3/27/2016.
 */
import {bindable, inject, computedFrom} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {AlertToaster} from 'global-resources';
import {AppActionCreators} from '../app-action-creators';

@inject(Store, AppActionCreators, AlertToaster)
export class Navbar {

    @connected('myAccount')
    account;

    @bindable router;

    @computedFrom('account')
    get firstFive() {
        return this.account && this.account.accountId ? this.account.accountId.slice(0, 5) : null;
    }

    constructor(store, appActionCreators, toaster) {
        this.store = store;
        this.appActionCreators = appActionCreators;
        this.toaster = toaster;
    }

    goToExchange() {
        this.router.navigateToRoute('exchange');
    }

    login() {
        this.router.navigateToRoute('login');
    }

    logout() {
        this.store.dispatch(this.appActionCreators.updateAccount());
        this.toaster.primary('Logged out successfully.');
    }

    goToAccount() {
        this.router.navigateToRoute('account');
    }
}
