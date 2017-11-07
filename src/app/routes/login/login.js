/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {Store} from 'au-redux';

@inject(Router, Store)
export class Login {

    action = 'login';

    constructor(router, store) {
        this.router = router;
        this.store = store;
    }

    onLoginSuccess() {
        this.router.navigateToRoute('account');
    }

    canActivate() {
        const account = this.store.getState().myAccount;

        if (account && account.accountId) {
            return new Redirect('exchange');
        }
    }

    changeAction(newAction) {
        this.action = newAction;
        this.loginTabs.selectTab('tab-' + newAction);
    }
}

