/**
 * Created by istrauss on 8/11/2017.
 */

import moment from 'moment';
import _throttle from 'lodash.throttle';

export class TradingviewBarsRealtimeFetcher {

    callsMade = 0;
    callsReceived = 0;

    /**
     *
     * @param resolution - in seconds
     * @param assetPair
     * @param marketResource
     * @param onFetchCallback
     */
    constructor(resolution, assetPair, marketResource, onFetchCallback) {
        this.resolution = resolution;
        this.assetPair = assetPair;
        this.marketResource = marketResource;
        this.onFetchCallback = onFetchCallback;

        this._fetch = _throttle(this._rawFetch.bind(this), 1000);
    }

    start() {
        this.interval = setInterval(this._fetch.bind(this), 2500);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    async _rawFetch() {
        this.callsMade++;

        const callNum = this.callsMade;

        const lastPriorBar = await this.marketResource.lastPriorBar(this.resolution, this.assetPair, moment().toISOString());

        this.callsReceived = Math.max(this.callsReceived, callNum);

        if (callNum === this.callsReceived) {
            this.onFetchCallback({
                ...lastPriorBar,
                time: moment(lastPriorBar.begin_ts).valueOf(),
                volume: lastPriorBar.sold_vol
            });
        }
    }
}
