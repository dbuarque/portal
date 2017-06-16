/**
 * Created by Ishai on 3/31/2016.
 */

//import URI from 'urijs';
import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {AppActionCreators} from '../../app-action-creators';

@inject(Router, AppStore, AppActionCreators)
export class Login {
    constructor(router, appStore, appActionCreators) {
        this.router = router;
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
    }

    onLoginSuccess() {
        this.router.navigateToRoute('account');
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (account && account.id) {
            return new Redirect('exchange');
        }
    }
}

