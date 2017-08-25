/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Store, ExchangeActionCreators)
export class OrderbookChart {

    constructor(store, exchangeActionCreators) {
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    async refresh() {
        this.store.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }

    updateFromStore() {
        const newState = this.store.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
        this.orderbook = exchange.orderbook
    }
}
