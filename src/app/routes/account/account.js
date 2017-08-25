/**
 * Created by istrauss on 4/22/2016.
 */

import _findIndex from 'lodash.findindex';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
 import {Store} from 'au-redux';
import Config from './account-config';

@inject(Config, EventAggregator, Store)
export class Account {

    constructor(config, eventAggregator, store) {
        this.config = config;
        this.eventAggregator = eventAggregator;

        this.store = store;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    canActivate() {
        const account = this.store.getState().account;

        if (!account) {
            return new Redirect('login');
        }
    }

    activate() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
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

    updateFromStore() {
        this.account = this.store.getState().account;

        if (!this.account) {
            this.router.parent.navigateToRoute('exchange');
        }
    }
}
