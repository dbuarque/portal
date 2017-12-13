/**
 * Created by Ishai on 3/31/2016.
 */

import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {connected} from 'aurelia-redux-connect';
import {LoginConfig} from './login.config';

@inject(LoginConfig, EventAggregator)
export class ObtainPublicKey {
    @connected('myAccount')
    account;

    addressGenerationMethods = [
        {
            routeName: 'generateKeypair',
            label: 'Generate A New Address'
        },
        {
            routeName: 'providePublicKey',
            label: 'I Already Have An Address'
        },
        {
            routeName: 'obtainFromLedgerNano',
            label: 'Use My Ledger Nano S'
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
        if (this.account) {
            this.router.parent.navigateToRoute('account');
        }
    }

    syncLoginMethodFromRouter() {
        this.method = this.addressGenerationMethods.find(m => m.routeName === this.router.currentInstruction.config.name);
    }

    changeMethod() {
        this.router.navigateToRoute(this.method.routeName);
    }
}
