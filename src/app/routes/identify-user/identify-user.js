/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {connected} from 'au-redux';

@inject(Router)
export class IdentifyUser {

    @connected('myAccount')
    account;

    action = 'login';

    constructor(router) {
        this.router = router;
    }

    canActivate() {
        if (this.account) {
            return new Redirect('exchange');
        }
    }

    accountChanged() {
        if (this.account) {
            this.router.navigateToRoute('account');
        }
    }

    changeAction(newAction) {
        this.action = newAction;
        this.loginTabs.selectTab('tab-' + newAction);
    }
}

