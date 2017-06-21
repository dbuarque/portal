/**
 * Created by istrauss on 3/16/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import Config from './exchange-config';
import {ExchangeActionCreators} from './exchange-action-creators';

@inject(Config, AppStore, ExchangeActionCreators)
export class Exchange {

    constructor(config, appStore, exchangeActionCreators) {
        this.config = config;
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        if (this.assetPair !== exchange.assetPair) {
            this.assetPair = exchange.assetPair;
            this.refresh();
        }

    }

    refresh() {
        this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }
}
