/**
 * Created by istrauss on 1/7/2017.
 */


import {namespace, tradingviewPriceChartActionTypes} from './tradingview-price-chart-action-types';

const {UPDATE_BARS} = tradingviewPriceChartActionTypes;

export class TradingviewPriceChartActionCreators {
    updateBars(bars) {
        return {
            type: UPDATE_BARS,
            payload: bars
        };
    }
}
