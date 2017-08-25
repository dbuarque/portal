/**
 * Created by istrauss on 3/27/2017.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';
import {Store} from 'au-redux';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Store, ExchangeActionCreators)
export class OffersCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) price;
    @bindable type;

    loading = 0;

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

    updateFromStore() {
        const newState = this.store.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
        this.orderbook = exchange.orderbook;
    }

    async refresh() {
        this.loading++;

        await this.store.dispatch(this.exchangeActionCreators.refreshOrderbook());

        this.loading--;
    }
}
