/**
 * Created by istrauss on 1/4/2017.
 */

import _find from 'lodash.find';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, exchangeActionTypes} from '../../../exchange-action-types';
import {orderbookChartActionTypes} from './orderbook-chart-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;
const {UPDATE_RANGE} = orderbookChartActionTypes;

let _orderbookChart = (state, action, rootState) => {
    let interval, start, end, presetRangeIndex;
    let smallestAllowedInterval;

    switch(action.type) {
        case UPDATE_RANGE:
            start = action.payload.start;
            end = action.payload.end;
            break;
        case UPDATE_ASSET_PAIR:
            if (isNewAssetPair(rootState.exchange.assetPair, action.payload)) {
                start = undefined;
                end = undefined;
            }
            break;
    }

    if (start && end && start > end) {
        if (start > end) {
            end = undefined;
        }
    }

    return {
        ...state,
        start,
        end
    };
};

function isNewAssetPair(oldAssetPair, newAssetPair) {
    return  oldAssetPair && newAssetPair &&
        !(
            oldAssetPair.buying.code === newAssetPair.buying.code &&
            oldAssetPair.buying.issuer === newAssetPair.buying.issuer &&
            oldAssetPair.selling.code === newAssetPair.selling.code &&
            oldAssetPair.selling.issuer === newAssetPair.selling.issuer
        );
}

export const orderbookChart = restrictReducerToNamespace(_orderbookChart, namespace);
