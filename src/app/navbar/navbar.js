/**
 * Created by Ishai on 3/27/2016.
 */
import {bindable, inject} from 'aurelia-framework';
import {AppStore} from 'utils';
import {AppActionCreators} from '../app-action-creators';

@inject(AppStore, AppActionCreators)
export class Navbar {
    @bindable router;

    constructor(appStore, appActionCreators) {
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
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
        this.firstFive = this.account ? this.account.id.slice(0, 5) : null;
    }

    login() {
        this.router.navigate(this.router.generate('public') + '/login');
    }

    logout() {
        this.appStore.dispatch(this.appActionCreators.updateIdentity());
    }

    goToProfile() {
        const route = this.router.generate('profile') + '/account';
        let profileUrl = this.router.navigate(route);
    }
}
