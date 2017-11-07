/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {MarketResource} from 'app-resources';
import {MarketStream} from './market-stream';
import {UpdateOrderbookActionCreator} from '../action-creators';

@inject(MarketResource, MarketStream, UpdateOrderbookActionCreator)
export class OrderbookUpdater {

    @connected('exchange.assetPair')
    assetPair;

    constructor(marketResource, marketStream, updateOrderbook) {
        this.marketResource = marketResource;
        this.marketStream = marketStream;
        this.updateOrderbook = updateOrderbook;
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
        this.updateOrderbook.dispatch(newOrderbook);

        // Now, subscribe to changes.
        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'orderbook') {
                return;
            }

            this.updateOrderbook.dispatch(payload.payload);
        });
    }
}
