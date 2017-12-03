/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
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
        // First simply get the new orderbook if there is an assetPair.
        if (this.assetPair) {
            const newTrades = await this.marketResource.recentTrades(this.assetPair);
            this.updateRecentTrades.dispatch(newTrades, true);
        }

        // Now, subscribe to changes (subscribeToStream will simply unsubscribe if there is no assetPair).
        this.subscribeToStream();
    }

    subscribeToStream() {
        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }

        if (!this.assetPair) {
            return;
        }

        // Now, subscribe to changes.
        this.unsubscribeFromStream = this.marketStream.subscribe(payload => {
            if (payload.type !== 'trades') {
                return;
            }

            // reverse() is needed because we want to dispatch the trades last to first in order of execution.
            this.updateRecentTrades.dispatch(
                payload.payload.trades.slice().reverse()
            );
        });
    }
}
