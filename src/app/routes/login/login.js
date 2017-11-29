/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {connected} from 'au-redux';
import {LoginConfig} from './login.config';

@inject(LoginConfig)
export class IdentifyUser {
    @connected('myAccount')
    account;

    loginMethods = [
        {
            routeName: 'publicKey',
            label: 'Public Key'
        },
        {
            routeName: 'secretKey',
            label: 'Secret Key'
        },
        {
            routeName: 'ledgerNano',
            label: 'Ledger Nano S'
        }
    ];

    constructor(config) {
        this.config = config;
    }

    canActivate() {
        if (this.account) {
            return new Redirect('exchange');
        }
    }

    attached() {
        this.loginMethod = this.loginMethods.find(m => m.routeName === this.router.currentInstruction.config.name);
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    accountChanged() {
        if (this.account) {
            this.router.parent.navigateToRoute('account');
        }
    }

    changeLoginMethod() {
        this.router.navigateToRoute(this.loginMethod.routeName);
    }
}
