/**
 * Created by istrauss on 4/22/2016.
 */

import './account.scss';
import _findIndex from 'lodash/findIndex';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {connected} from 'aurelia-redux-connect';
import {AccountConfig} from './account.config';

@inject(AccountConfig, EventAggregator)
export class Account {
    @connected('myAccount')
    account;

    get routableRoutes() {
        return this.config.routes.filter(r => !r.redirect);
    }

    constructor(config, eventAggregator) {
        this.config = config;
        this.eventAggregator = eventAggregator;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    attached() {
        this.subscription = this.eventAggregator.subscribe(
            'router:navigation:success',
            this.navigationSuccess.bind(this));

        this.navigationSuccess();
    }

    detached() {
        this.subscription.dispose();
    }

    refresh() {
        if (!this.currentViewModel || this.currentViewModel.refreshing) {
            return;
        }

        this.currentViewModel.refresh();
    }

    navigationSuccess() {
        const viewPortInstruction = this.router.currentInstruction.viewPortInstructions.default;

        if (viewPortInstruction.strategy === 'no-change') {
            return;
        }

        this.currentViewModel = viewPortInstruction.controller.viewModel;
        this.currentRoute = this.router.currentInstruction.config.route.split('/')[0];

        let routeName = this.router.currentInstruction.config.name;
        routeName = _findIndex(this.config.routes, {name: routeName}) > -1 ? routeName : 'profile';
        this.accountTabs.selectTab('tab-' + routeName);
    }

    navigateToRoute(routeName) {
        if (this.router.currentInstruction.config.name !== routeName) {
            this.router.navigateToRoute(routeName);
        }
    }

    accountChanged() {
        if (!this.account) {
            this.router.parent.navigateToRoute('exchange');
        }
    }
}
