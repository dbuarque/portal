/**
 * Created by istrauss on 1/4/2017.
 */

import moment from 'moment';
import _find from 'lodash.find';
import {combineReducersProvideRootState} from 'au-redux';
import {namespace, exchangeActionTypes} from '../../../exchange-action-types';
import {isNewAssetPair} from '../../../exchange-reducers';
import {tradingviewPriceChartActionTypes} from './tradingview-price-chart-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;
const {UPDATE_BARS} = tradingviewPriceChartActionTypes;

export const tradingviewPriceChart = combineReducersProvideRootState({
    bars
});

function bars(state, action, rootState) {
    switch (action.type) {
        case UPDATE_BARS:
            if (!action.payload) {
                return undefined;
            }

            if (Array.isArray(action.payload)) {
                return action.payload;
            }

            return updateLastBar(state, action.payload);
        case UPDATE_ASSET_PAIR:
            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? undefined : state;
        default:
            return state;
    }
}

function resolution() {

}

function interval() {

}

function updateLastBar(bars, newLedgerPayload) {

}
