/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {MarketResource, assetPairsAreDifferent} from 'app-resources';
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
        //calling bind, connects the connected properties
        this.bind();
        this._start();
    }

    deinit() {
        this._stop();
        this.unbind();
    }

    async assetPairChanged() {
        this.restart();
    }

    restart() {
        if (
            !assetPairsAreDifferent(this.assetPair, this.previousAssetPair)
        ) {
            return;
        }

        this._stop();

        if (!this.assetPair) {
            return;
        }

        this._start();
    }

    _stop() {
        this.previousAssetPair = undefined;

        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }
    }

    async _start() {
        this.previousAssetPair = this.assetPair;

        const newOrderbook = await this.marketResource.orderbook(this.assetPair);
        this.updateOrderbook.dispatch(newOrderbook);

        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'orderbook') {
                return;
            }

            this.updateOrderbook.dispatch(payload.payload);
        });
    }
}
