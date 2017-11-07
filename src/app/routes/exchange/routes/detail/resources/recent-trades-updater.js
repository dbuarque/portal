/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {MarketResource} from 'app-resources';
import {MarketStream} from './market-stream';
import {UpdateRecentTradesActionCreator} from '../action-creators';

@inject(MarketResource, MarketStream, UpdateRecentTradesActionCreator)
export class RecentTradesUpdater {

    @connected('exchange.assetPair')
    assetPair;

    constructor(marketResource, marketStream, updateRecentTrades) {
        this.marketResource = marketResource;
        this.marketStream = marketStream;
        this.updateRecentTrades = updateRecentTrades;
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
        const newTrades = await this.marketResource.recentTrades(this.assetPair);
        this.updateRecentTrades.dispatch(newTrades);

        // Now, subscribe to changes.
        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'trades') {
                return;
            }

            this.updateRecentTrades.dispatch(
                payload.payload.trades.reverse()
            );
        });
    }
}
