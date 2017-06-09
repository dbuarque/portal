/**
 * Created by Ishai on 3/27/2016.
 */
import {bindable, inject} from 'aurelia-framework';
import {AppStore, AlertToaster} from 'global-resources';
import {AppActionCreators} from '../app-action-creators';

@inject(AppStore, AppActionCreators, AlertToaster)
export class Navbar {
    @bindable router;

    constructor(appStore, appActionCreators, toaster) {
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
        this.toaster = toaster;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        this.account = newState.account;
        this.firstFive = this.account && this.account.id ? this.account.id.slice(0, 5) : null;
    }

    goToExchange() {
        this.router.navigateToRoute('exchange');
    }

    login() {
        this.router.navigateToRoute('login');
    }

    logout() {
        this.toaster.primary('Logged out successfully.');
        this.appStore.dispatch(this.appActionCreators.setAccount());
    }

    goToAccount() {
        this.router.navigateToRoute('account');
    }
}
