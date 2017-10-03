/**
 * Created by istrauss on 8/9/2017.
 */

import moment from 'moment-timezone';
import {transient, inject} from 'aurelia-framework';
import {TradingviewPriceChartDatafeedAdapter} from './tradingview-price-chart-datafeed-adapter';

@transient()
@inject(TradingviewPriceChartDatafeedAdapter)
export default class TradingviewPriceChartConfig {
    constructor(datafeed) {
        return {
            interval: '15',
            timezone: moment.tz.guess(),
            container_id: 'tradingview-price-chart-container',
            datafeed,
            debug: window.lupoex.env === 'development',
            library_path: '/assets/charting_library/charting_library/',
            autosize: true,
            toolbar_bg: '#ffffff',
            locale: "en",
            time_frames: [
                { text: "5y", resolution: "W", description: '5 Years' },
                { text: "1y", resolution: "W", description: '1 Year' },
                { text: "1mo", resolution: "D", description: '1 Month' },
                { text: "4d", resolution: "240", description: '4 Days' },
                { text: "2d", resolution: "60", description: '2 Days' },
                { text: "1d", resolution: "15", description: '1 Day' },
                { text: "4hr", resolution: "5", description: '4 Hours' },
                { text: "1hr", resolution: "1", description: '1 Hour' }
            ],
            disabled_features: [
                "left_toolbar",
                "header_widget",
                "compare_symbol",
                "timeframes_toolbar",
                "border_around_the_chart",
                "context_menus",
                "edit_buttons_in_legend",
                "use_localstorage_for_settings",
                "source_selection_markers"
            ],
            enabled_features: [
                "move_logo_to_main_pane",
                "hide_last_na_study_output"
            ],
            overrides: {
                "mainSeriesProperties.candleStyle.drawBorder": false,
                "mainSeriesProperties.candleStyle.upColor": "#388e3c",
                "mainSeriesProperties.candleStyle.downColor": "#c62828",
                "mainSeriesProperties.candleStyle.wickUpColor": "#000000",
                "mainSeriesProperties.candleStyle.wickDownColor": "#000000",
                "scalesProperties.lineColor" : "#e0e0e0"
            },
            studies_overrides: {
                "volume.volume.color.0": "#08b5e5",
                "volume.volume.color.1": "#08b5e5",
                "volume.volume.transparency": 75,
                "volume.volume.linewidth": 1,
                //"volume.volume ma.color": "#5b6a72",
                //"volume.volume ma.transparency": 85,
                //"volume.show ma": true
            },
            supported_resolutions: [
                { text: "1min", resolution: "1", description: '1 Minute' },
                { text: "5min", resolution: "5", description: '5 Minutes' },
                { text: "15min", resolution: "15", description: '15 Minutes' },
                { text: "1hr", resolution: "60", description: '1 Hour' },
                { text: "4hr", resolution: "240", description: '4 Hours' },
                { text: "1d", resolution: "D", description: '1 Day' },
                { text: "2d", resolution: "2D", description: '2 Days' },
                { text: "4d", resolution: "4D", description: '4 Days' },
                { text: "1w", resolution: "W", description: '1 Week' }
            ],
            custom_css_url: '../../../custom-charting.css'
        };
    }
}
