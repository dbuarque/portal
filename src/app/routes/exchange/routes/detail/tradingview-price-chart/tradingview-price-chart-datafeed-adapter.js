/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment-timezone';
import {inject} from 'aurelia-framework';
import {MarketResource} from 'app-resources';
import {TradingviewPriceChartSymbolInfo} from './tradingview-price-chart-symbol-info';
import {TradingviewBarsRealtimeUpdater} from './tradingview-bars-realtime-updater';
import {resolutionToSeconds} from './tradingview-price-chart-utils';

@inject(MarketResource, TradingviewBarsRealtimeUpdater)
export class TradingviewPriceChartDatafeedAdapter {

    configurationData = {
        exchanges: [],
        symbol_types: [],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true
    };

    constructor(marketResource, realtimeUpdater) {
        this.marketResource = marketResource;
        this.realtimeUpdater = realtimeUpdater;
    }

    async onReady(callback) {
        setTimeout(() => {
            callback(this.configurationData);
        }, 0);
    }

    searchSymbolsByName(userInput, exchange, symbolType, onResultReadyCallback) {
        // Not implemented for now (searching stellar assets by name is hard to due code+issuer combination, maybe sometime in the future?)
        throw new Error('TradingviewPriceChartDatafeedAdapter.searchSymbolsByName() is not implemented.');
    }

    async resolveSymbol(ticker, onSymbolResolvedCallback, onResolveErrorCallback) {
        setTimeout(() => {
            onSymbolResolvedCallback(
                new TradingviewPriceChartSymbolInfo(ticker, 'TODO')
            );
        }, 0);
    }

    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        try {
            const bars = await this.marketResource.bars(
                resolutionToSeconds(resolution),
                symbolInfo.assetPair,
                moment.unix(from).toISOString(),
                firstDataRequest ? undefined : moment.unix(to).toISOString()
            );

            const interpretedBars = bars.map(bar => {
                return {
                    ...bar,
                    time: moment(bar.begin).valueOf(),
                    volume: bar.soldVolume
                };
            });

            const meta = {};

            if (interpretedBars.length === 0) {
                const lastPreviousBar = await this.marketResource.lastPriorBar(
                    resolutionToSeconds(resolution),
                    symbolInfo.assetPair,
                    moment.unix(from).toISOString()
                );

                if (lastPreviousBar) {
                    meta.nextTime = moment(lastPreviousBar.begin).valueOf();
                }
                else {
                    meta.noData = true;
                }
            }

            onHistoryCallback(interpretedBars, meta);
        }
        catch(e) {
            onErrorCallback(e.message);
        }
    }

    async subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        this.realtimeUpdater.restart(resolutionToSeconds(resolution), onRealtimeCallback);
    }

    async unsubscribeBars(subscriberUID) {
        this.realtimeUpdater.stop();
    }

    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        //Returns undefined because no override for now.
    }

    getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
        throw new Error('TradingviewPriceChartDatafeedAdapter.getMarks() is not implemented.');
    }

    getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
        throw new Error('TradingviewPriceChartDatafeedAdapter.getTimescaleMarks() is not implemented.');
    }

    getServerTime(callback) {
        return moment.unix();
    }


}
