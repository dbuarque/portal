/**
 * Created by istrauss on 1/4/2017.
 */

import moment from 'moment';
import _find from 'lodash.find';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, exchangeActionTypes} from '../../../exchange-action-types';
import {tradingviewPriceChartActionTypes} from './tradingview-price-chart-action-types';

const {UPDATE_BAR, UPDATE_BARS, INCREMENT_LOADING, DECREMENT_LOADING} = tradingviewPriceChartActionTypes;

let _tradingviewPriceChart = combineReducersProvideRootState({
    bars,
    loading
});

function bars(state, action, rootState) {

}

function loading(state, action) {
    switch(action.type) {
        case INCREMENT_LOADING:
            return state + 1;
        case DECREMENT_LOADING:
            return state - 1;
        default:
            return state || 0;
    }
}

export const tradingviewPriceChart = restrictReducerToNamespace(_tradingviewPriceChart, namespace);
