/**
 * Created by istrauss on 4/22/2016.
 */

import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AppStore} from 'global-resources';
import Config from './account-config';

@inject(Config, EventAggregator, AppStore)
export class Account {

    constructor(config, eventAggregator, appStore) {
        this.config = config;
        this.eventAggregator = eventAggregator;

        this.appStore = appStore;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (!account) {
            return new Redirect('login');
        }
    }

    activate() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    attached() {
        this.subscription = this.eventAggregator.subscribe(
            'router:navigation:success',
            this.navigationSuccess.bind(this));
    }

    detached() {
        this.subscription.dispose();
    }

    navigationSuccess(event) {
        const routeName = event.instruction.fragment.split('/')[2] || 'profile';
        this.accountTabs.selectTab('tab-' + routeName);
    }

    updateFromStore() {
        this.account = this.appStore.getState().account;

        if (!this.account) {
            this.router.parent.navigateToRoute('exchange');
        }
    }
}
