/**
 * Created by istrauss on 4/22/2016.
 */

import {inject} from 'aurelia-framework';
import {Redirect, Router} from 'aurelia-router';
import {AppStore} from 'global-resources';

@inject(Router, AppStore)
export class Account {

    constructor(router, appStore) {
        this.router = router;
        this.appStore = appStore;
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (!account) {
            return new Redirect('login');
        }
    }

    activate() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    deactivate() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        this.account = this.appStore.getState().account;

        if (!this.account) {
            this.router.navigateToRoute('exchange');
        }
    }
}
