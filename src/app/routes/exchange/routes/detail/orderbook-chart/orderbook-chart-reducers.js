/**
 * Created by istrauss on 1/4/2017.
 */

import _find from 'lodash.find';
import {ReducerHelper} from 'global-resources';
import {namespace, orderbookChartActionTypes} from './orderbook-chart-action-types';

const {UPDATE_RANGE} = orderbookChartActionTypes;

let _orderbookChart = (state, action) => {
    let interval, start, end, presetRangeIndex;
    let smallestAllowedInterval;

    switch(action.type) {
        case UPDATE_RANGE:
            start = action.payload.start;
            end = action.payload.end;
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

export const orderbookChart = ReducerHelper.restrictReducerToNamespace(_orderbookChart, namespace);
