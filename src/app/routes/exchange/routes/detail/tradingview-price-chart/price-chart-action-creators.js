/**
 * Created by istrauss on 1/7/2017.
 */


import {namespace, tradingviewPriceChartActionTypes} from './tradingview-price-chart-action-types';

const {UPDATE_BAR, UPDATE_BARS, INCREMENT_LOADING, DECREMENT_LOADING} = tradingviewPriceChartActionTypes;

export class TradingviewPriceChartActionCreators {
    updateBar(bar) {
        return {
            type: UPDATE_BAR,
            payload: bar
        };
    }

    updateBars(bars) {
        return {
            type: UPDATE_BARS,
            payload: bars
        };
    }

    decrementLoading() {
        return {
            type: DECREMENT_LOADING
        };
    }

    incrementLoading() {
        return {
            type: INCREMENT_LOADING
        };
    }

    refreshBars() {
        return async (dispatch, getState) => {
            this.incrementLoading();



            this.decrementLoading();
        }
    }
}
