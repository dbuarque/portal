/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment';
import {inject} from 'aurelia-framework';
import {TradingviewPriceChartSymbolInfo} from './tradingview-price-chart-symbol-info';
import {MarketResource} from 'app-resources';

@inject(MarketResource)
export class TradingviewPriceChartDatafeedAdapter {

    configurationData = {
        exchanges: [],
        symbol_types: [],
        resolutions: [
            1,
            5,
            15,
            60,
            60 * 4,
            60 * 24,
            60 * 24 * 7
        ],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false
    };

    constructor(marketResource) {
        this.marketResource = marketResource;
    }

    onReady(callback) {
        callback(this.configurationData);
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

        onSymbolResolvedCallback(
            new TradingviewPriceChartSymbolInfo(ticker, 'TODO')
        );
    }

    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        try {
            const bars = await this.tickerResource.list(
                this.resolutionToSeconds(resolution),
                symbolInfo.assetPair,
                from,
                firstDataRequest ? undefined : to
            );

            onHistoryCallback(
                bars.map(bar => {
                    return {
                        ...bar,
                        time: moment(bar.begin_ts).unix(),
                        volume: bar.sold_vol
                    };
                })
            );
        }
        catch(e) {
            onErrorCallback(e.message);
        }
    }

    async subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {

    }

    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        //Returns undefined because eno override for now.
    }

    getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
        throw new Error('TradingviewPriceChartDatafeedAdapter.getServerTime() is not implemented.');
    }

    getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
        throw new Error('TradingviewPriceChartDatafeedAdapter.getServerTime() is not implemented.');
    }

    getServerTime(callback) {
        throw new Error('TradingviewPriceChartDatafeedAdapter.getServerTime() is not implemented.');
    }

    resolutionToSeconds(resolution) {
        let multiplicationFactor = 1;

        if (resolution.indexOf('D') > -1) {
            multiplicationFactor = 60 * 60 * 24;
        }
        else if (resolution.indexOf('W') > -1) {
            multiplicationFactor = 60 * 60 * 24 * 7;
        }

        let result = resolution.replace(/[DW]/, '');

        result = parseInt(result, 10);

        if (isNaN(result)) {
            throw new Error('Could not convert resolution: ' + resolution + ' to seconds.');
        }

        return result * multiplicationFactor;
    }
}