/**
 * Created by istrauss on 8/9/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {TradingviewPriceChartDatafeedAdapter} from './tradingview-price-chart-datafeed-adapter';

@transient()
@inject(TradingviewPriceChartDatafeedAdapter)
export default class TradingviewPriceChartConfig {
    constructor(datafeed) {
        return {
            interval: '5M',
            container_id: 'tradingview-price-chart-container',
            datafeed,
            debug: window.lupoex.env === 'development',
            library_path: '/assets/charting_library/charting_library/',
            autosize: true,
            toolbar_bg: 'white'
        };
    }
}
