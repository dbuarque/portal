/**
 * Created by istrauss on 3/16/2017.
 */

import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import Config from './exchange-config';
import {ExchangeActionCreators} from './exchange-action-creators';

@inject(Config, Store, ExchangeActionCreators)
export class Exchange {

    constructor(config, store, exchangeActionCreators) {
        this.config = config;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.store.getState();
        const exchange = newState.exchange;

        if (this.assetPair !== exchange.assetPair) {
            this.assetPair = exchange.assetPair;
            this.refresh();
        }

    }

    refresh() {
        this.store.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }
}
