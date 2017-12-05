import {inject} from 'aurelia-framework';
import {MarketResource} from 'app-resources';
import {TopMarketsStream} from './top-markets-stream';
import {UpdateTopTenMarketsActionCreator} from '../action-creators';

@inject(MarketResource, TopMarketsStream, UpdateTopTenMarketsActionCreator)
export class TopTenMarketsUpdater {
    constructor(marketResource, topMarketsStream, updateTopTenMarkets) {
        this.marketResource = marketResource;
        this.topMarketsStream = topMarketsStream;
        this.updateTopTenMarkets = updateTopTenMarkets;
    }

    async start() {
        this.stop();

        const topTenMarkets = await this.marketResource.top();
        this.updateTopTenMarkets.dispatch(topTenMarkets);
        this.unsubscribeFromStream = this.topMarketsStream.subscribe(payload => {
            this.updateTopTenMarkets.dispatch(payload);
        });
    }

    stop() {
        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
        }
    }
}
