import {computedFrom} from 'aurelia-framework';
import {connected} from 'au-redux';

export class RecentTradesCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.recentTrades')
    trades;

    @computedFrom('trades')
    get anyTrades() {
        return this.trades && this.trades.length > 0;
    }
}
