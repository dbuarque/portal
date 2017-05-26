/**
 * Created by istrauss on 3/27/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(AppStore, ExchangeActionCreators)
export class OrderbookCustomElement {

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

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
        this.orderbook = exchange.orderbook;
    }

    async refresh() {
        this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }
}
