/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(AppStore, ExchangeActionCreators)
export class OrderbookChart {

    constructor(appStore, exchangeActionCreators) {
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    async refresh() {
        this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
        this.orderbook = exchange.orderbook
    }
}
