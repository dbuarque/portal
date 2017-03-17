/**
 * Created by Ishai on 3/31/2016.
 */

import URI from 'urijs';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'utils';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Router, AppStore, AppActionCreators)
export class Login {
    constructor(router, appStore, appActionCreators) {
        this.router = router;
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
    }

    onLoginSuccess(evt) {
        this.appStore.dispatch(this.appActionCreators.updateIdentity(evt.detail));
        this.router.parent.navigateToRoute(this.redirect.route, this.redirect.params);
    }

    canActivate() {
        let uri = URI();
        let params = uri.search(true);

        if (params.redirect) {
            this.redirect = {
                route: params.redirect,
                params: Object.keys(params).reduce((_params, key) => {
                    if (key !== 'redirect') {
                        _params[key] = params[key];
                    }
                    return _params;
                }, {})
            };
        }
        else {
            this.redirect = {
                route: 'public'
            };
        }

        this.action = params.action;
    }

    activate() {
        if (window.stellrex.env === 'development') {
            this.devAlertConfig = {
                type: 'info',
                message: 'Hey, we noticed you are running in development mode. This site connects to the testnet in development mode. If you have a testnet stellar account, you can use that to login. Otherwise, you can use the following to login <br><ul><li>Public Key: GDH5E3PIYCHMUQHWJBUYM3BDO37FEBUIKSNEXDGNEGZ3KO5WIX4C2Z7K</li><li>Secret Key: SAFO66G2WUOEL6ES6J7Q773R7Y57YQPK544C44HUHRS2MJ5PRS3MZNSD</li></ul>'
            };
        }
    }
}

