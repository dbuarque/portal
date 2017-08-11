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
            interval: '60',
            timeframe: 'D',
            container_id: 'tradingview-price-chart-container',
            datafeed,
            debug: window.lupoex.env === 'development',
            library_path: '/assets/charting_library/charting_library/',
            autosize: true,
            toolbar_bg: '#ffffff',
            locale: "en",
            time_frames: [
                { text: "5y", resolution: "W" },
                { text: "1y", resolution: "W" },
                { text: "1m", resolution: "D" },
                { text: "4d", resolution: "240" },
                { text: "2d", resolution: "60" },
                { text: "1d", resolution: "60" },
                { text: "4h", resolution: "5" },
                { text: "1h", resolution: "1" }
            ],
            disabled_features: ["header_widget", "left_toolbar", "timeframes_toolbar", "border_around_the_chart"],
            enabled_features: ["move_logo_to_main_pane"]
        };
    }
}
