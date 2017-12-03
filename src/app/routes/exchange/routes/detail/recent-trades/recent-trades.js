import {inject} from 'aurelia-framework';
import {BindingSignaler} from 'aurelia-templating-resources';
import {computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';

@inject(BindingSignaler)
export class RecentTradesCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.recentTrades')
    trades;

    @computedFrom('trades')
    get anyTrades() {
        return this.trades && this.trades.length > 0;
    }

    constructor(signaler) {
        this.signaler = signaler;
    }

    bind() {
        const self = this;

        this.timeAgoInterval = setInterval(() => self.signaler.signal('update-timeago-signal'), 5000);
    }

    unbind() {
        if (this.timeAgoInterval) {
            clearInterval(this.timeAgoInterval);
        }
    }
}
