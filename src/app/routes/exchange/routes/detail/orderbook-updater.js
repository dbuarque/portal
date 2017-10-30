/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {MarketResource} from 'app-resources';
import {MarketStream} from './market-stream';
import {DetailActionCreators} from './detail-action-creators';

@inject(Store, MarketResource, MarketStream, DetailActionCreators)
export class OrderbookUpdater {

    @connected('exchange.assetPair')
    assetPair;

    constructor(store, marketResource, marketStream, detailActionCreators) {
        this.store = store;
        this.marketResource = marketResource;
        this.marketStream = marketStream;
        this.detailActionCreators = detailActionCreators;
    }

    init() {
        //calling bind, connects the assetPair which will trigger the assetPairChanged listener.
        this.bind();
    }

    async assetPairChanged() {
        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }

        if (!this.assetPair) {
            return;
        }

        // First simply get the new orderbook.
        const newOrderbook = await this.marketResource.orderbook(this.assetPair);
        this.store.dispatch(this.detailActionCreators.updateOrderbook(newOrderbook));

        // Now, subscribe to changes.
        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'orderbook') {
                return;
            }

            this.store.dispatch(this.detailActionCreators.updateOrderbook(payload.payload));
        });
    }
}
