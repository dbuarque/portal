/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
 import {Store} from 'au-redux';
import {AppActionCreators} from '../../app-action-creators';

@inject(Router, Store, AppActionCreators)
export class Login {

    action = 'login';

    constructor(router, store, appActionCreators) {
        this.router = router;
        this.store = store;
        this.appActionCreators = appActionCreators;
    }

    onLoginSuccess() {
        this.router.navigateToRoute('account');
    }

    canActivate() {
        const account = this.store.getState().account;

        if (account && account.id) {
            return new Redirect('exchange');
        }
    }

    changeAction(newAction) {
        this.action = newAction;
        this.loginTabs.selectTab('tab-' + newAction);
    }
}

