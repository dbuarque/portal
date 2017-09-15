/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment-timezone';
import {inject} from 'aurelia-framework';
import {MarketResource} from 'app-resources';
import {TradingviewPriceChartSymbolInfo} from './tradingview-price-chart-symbol-info';
import {TradingviewBarsRealtimeUpdater} from './tradingview-bars-realtime-updater';

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
        //const symbolInfo = new TradingviewPriceChartSymbolInfo(ticker, 'TODO');
        //const assets = await Promise.all([
        //    this.assetResource.findOne(splitTicker[0], splitTicker[1]),
        //    this.assetResource.findOne(splitTicker[2], splitTicker[3])
        //]);
        setTimeout(() => {
            onSymbolResolvedCallback(
                new TradingviewPriceChartSymbolInfo(ticker, 'TODO')
            );
        }, 0);
    }

    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        try {
            const bars = await this.marketResource.bars(
                this.resolutionToSeconds(resolution),
                symbolInfo.assetPair,
                moment.unix(from).toISOString(),
                firstDataRequest ? undefined : moment.unix(to).toISOString()
            );

            const interpretedBars = bars.map(bar => {
                return {
                    ...bar,
                    time: moment(bar.begin_ts).valueOf(),
                    volume: bar.sold_vol
                };
            });

            const meta = {};

            if (interpretedBars.length === 0) {
                const lastPreviousBar = await this.marketResource.lastPriorBar(
                    this.resolutionToSeconds(resolution),
                    symbolInfo.assetPair,
                    moment.unix(from).toISOString()
                );

                if (lastPreviousBar) {
                    meta.nextTime = moment(lastPreviousBar.begin_ts).valueOf();
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
        this.realtimeUpdater.restart(this.resolutionToSeconds(resolution), onRealtimeCallback);
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

    resolutionToSeconds(resolution) {
        let multiplicationFactor = 60;

        if (resolution.indexOf('D') > -1) {
            multiplicationFactor = 60 * 60 * 24;
        }
        else if (resolution.indexOf('W') > -1) {
            multiplicationFactor = 60 * 60 * 24 * 7;
        }

        let result = resolution.replace(/[DW]/, '');

        result = parseInt(result || 1, 10);

        if (isNaN(result)) {
            throw new Error('Could not convert resolution: ' + resolution + ' to seconds.');
        }

        return result * multiplicationFactor;
    }
}