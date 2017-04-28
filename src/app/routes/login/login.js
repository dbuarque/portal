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
        this.router.navigateToRoute('exchange');
        //this.router.parent.navigateToRoute(this.redirect.route, this.redirect.params);
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (account && account.id) {
            return new Redirect('exchange');
        }
    }

    activate() {
        if (window.lupoex.env === 'development') {
            this.devAlertConfig = {
                type: 'info',
                message: 'Hey, we noticed you are running in development mode. This site connects to the testnet in development mode. If you have a testnet stellar account, you can use that to login. Otherwise, you can use the following to login <br><ul><li>Public Key: GDH5E3PIYCHMUQHWJBUYM3BDO37FEBUIKSNEXDGNEGZ3KO5WIX4C2Z7K</li><li>Secret Key: SAFO66G2WUOEL6ES6J7Q773R7Y57YQPK544C44HUHRS2MJ5PRS3MZNSD</li></ul>'
            };
        }

        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    deactivate() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        this.account = this.appStore.getState().account;

        if (this.account) {
            this.onLoginSuccess();
        }
    }
}

