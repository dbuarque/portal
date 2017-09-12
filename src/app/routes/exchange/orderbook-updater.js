/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {MarketResource} from 'app-resources';
import {MarketStream} from './market-stream';
import {ExchangeActionCreators} from './exchange-action-creators';

@inject(Store, MarketResource, MarketStream, ExchangeActionCreators)
export class OrderbookUpdater {

    @connected('exchange.assetPair')
    assetPair;

    constructor(store, marketResource, marketStream, exchangeActionCreators) {
        this.store = store;
        this.marketResource = marketResource;
        this.marketStream = marketStream;
        this.exchangeActionCreators = exchangeActionCreators;

        this.bind();
    }

    async assetPairChanged() {
        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }

        if (!this.assetPair) {
            this.store.dispatch(this.exchangeActionCreators.updateOrderbook());
            return;
        }

        // First simply get the new orderbook.
        const newOrderbook = await this.marketResource.orderbook(this.assetPair);
        this.store.dispatch(this.exchangeActionCreators.updateOrderbook(newOrderbook));

        // Now, subscribe to changes.
        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'asks' && payload.type !== 'bids') {
                return;
            }

            this.store.dispatch(this.exchangeActionCreators.updateOrderbook({
                [payload.type]: payload.payload
            }));
        });
    }
}
