/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {connected} from 'aurelia-redux-connect';
import {LoginConfig} from './login.config';

@inject(LoginConfig, EventAggregator)
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

    constructor(config, eventAggregator) {
        this.config = config;
        this.eventAggregator = eventAggregator;
    }

    canActivate() {
        if (this.account) {
            return new Redirect('exchange');
        }
    }

    attached() {
        this.subscription = this.eventAggregator.subscribe('router:navigation:success', this.syncLoginMethodFromRouter.bind(this));
        this.syncLoginMethodFromRouter();
    }

    detached() {
        this.subscription.dispose();
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    accountChanged() {
        if (this.account && Object.keys(this.account).length > 1) {
            this.router.parent.navigateToRoute('account');
        }
    }

    syncLoginMethodFromRouter() {
        this.loginMethod = this.loginMethods.find(m => m.routeName === this.router.currentInstruction.config.name);
    }

    changeLoginMethod() {
        this.router.navigateToRoute(this.loginMethod.routeName);
    }
}
