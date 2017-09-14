/**
 * Created by istrauss on 8/4/2017.
 */

import BigNumber from 'bignumber.js';
import moment from 'moment';
import {inject} from 'aurelia-framework';
import {subscriptionService} from 'global-resources';
import {MarketStream} from '../../../market-stream';

@subscriptionService()
@inject(MarketStream)
export class LastBarTracker {

    _resolution;
    _lastPriorBar;
    _assetPair;
    _emptyBar = {
        high: -Infinity,
        low: Infinity,
        volume: 0,
        bought_vol: 0,
        sold_vol: 0
    };

    constructor(marketStream) {
        this.marketStream = marketStream;
    }

    /**
     * Configures the LedgerTradesPayloadsQueue.
     * The LedgerTradesPayloadsQueue will not handle new trades before being configured with a resolution.
     * @param [config] - If a config is not specified the LastBarTracker will be stopped.
     * @param [config.resolution] resolution in seconds
     */
    reconfigure(config = {}) {
        this._resolution = config.resolution;
        this._reset();
    }

    get() {
        if (!this._resolution) {
            return Promise.resolve();
        }

        if (!this._lastPriorBar || this._assetPair !== this.marketStream.assetPair) {
            this._assetPair = this.marketStream.assetPair;

            this._lastPriorBarPromise = this.marketResource.lastPriorBar(
                this._resolutionToSeconds(this._resolution),
                this._assetPair,
                moment.toISOString()
            )
                .then(lpb => {
                    this._lastPriorBar = {
                        ...lpb,
                        time: moment(lpb.begin_ts).valueOf(),
                        volume: lpb.sold_vol
                    }
                });
        }

        return this._lastPriorBarPromise
            .then(() => {
                return this._lastPriorBar;
            });
    }

    getEmptyBar() {
        return {
            ...this._emptyBar
        };
    }

    timeToBarTime(dateTime) {
        let barDateTime = moment(this._lastPriorBar.time);

        while(moment(barDateTime).add(this._resolution, 'seconds').isBefore(moment(dateTime))) {
            barDateTime.add(this._resolution, 'seconds');
        }

        return barDateTime.valueOf();
    }

    _reset() {
        this._lastPriorBar = undefined;

        if (!this._resolution && this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }
        else if (this._resolution && !this.unsubscribeFromStream) {
            this.unsubscribeFromStream = this.marketStream.subscribe(this._handleMarketStreamPayload.bind(this));
        }
    }

    async _handleMarketStreamPayload(type, payload) {
        if (!this._resolution || type !== 'trades') {
            return;
        }

        const lastPriorBar = await this.get();

        await this._updateBarWithNewTrades(lastPriorBar, payload);
        
        this._notifySubscribers(lastPriorBar);
    }

    async _updateBarWithNewTrades(bar, ledgerTradesPayload) {
        if (this._tradesBelongToNextBar(bar, ledgerTradesPayload)) {
            const nextBarTime = this.timeToBarTime(ledgerTradesPayload.ledger.ledger_ts);
            Object.assign(bar, {
                ...this._emptyBar,
                time: nextBarTime
            });
        }

        ledgerTradesPayload.forEach(this._addTradeToBar.bind(this, bar));
    }

    _addTradeToBar(bar, trade) {
        Object.assign(bar, {
            ...{
                high: BigNumber.max(bar.high, trade.price),
                low: BigNumber.min(bar.low, trade.price),
                bought_vol: (new BigNumber(bar.bought_vol)).add(trade.bought_vol).toString(10),
                sold_vol: (new BigNumber(bar.sold_vol)).add(trade.sold_vol).toString(10),
                volume: (new BigNumber(bar.volume)).add(trade.sold_vol).toString(10)
            }
        });
    }

    _tradesBelongToNextBar(lastPriorBar, ledgerTradesPayload) {
        const endOfPriorBar = moment(lastPriorBar.time).add(this._resolution, 'seconds');
        return moment(ledgerTradesPayload.ledger.closedAt).isAfter(endOfPriorBar);
    }
}
