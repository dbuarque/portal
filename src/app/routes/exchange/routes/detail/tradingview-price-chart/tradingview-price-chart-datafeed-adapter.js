/**
 * Created by istrauss on 8/4/2017.
 */

import {inject} from 'aurelia-framework';
import {TradingviewPriceChartSymbolInfo} from './tradingview-price-chart-symbol-info';
import {MarketResource} from 'app-resources';

@inject(MarketResource)
export class TradingviewPriceChartDatafeedAdapter {

    configurationData = {
        exchanges: [],
        symbol_types: [],
        resolutions: [],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true
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
        const splitTicker = ticker.split('_');
        const assets = await Promise.all([
            this.assetResource.findOne(splitTicker[0], splitTicker[1]),
            this.assetResource.findOne(splitTicker[2], splitTicker[3])
        ]);

        onSymbolResolvedCallback(
            new TradingviewPriceChartSymbolInfo(ticker, 'TODO')
        );
    }
}