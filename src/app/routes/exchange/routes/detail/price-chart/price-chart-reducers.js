/**
 * Created by istrauss on 1/4/2017.
 */

import moment from 'moment';
import _find from 'lodash.find';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, exchangeActionTypes} from '../../../exchange-action-types';
import {priceChartActionTypes} from './price-chart-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;
const {UPDATE_INTERVAL, UPDATE_RANGE, PRESET_RANGE} = priceChartActionTypes;

const intervalOptions = [
    {
        interval: 60,
        label: '1m',
        disabled: false
    },
    {
        interval: 5 * 60,
        label: '5m',
        disabled: false
    },
    {
        interval: 15 * 60,
        label: '15m',
        disabled: false
    },
    {
        interval: 60 * 60,
        label: '1h',
        disabled: false
    },
    {
        interval: 4 * 60 * 60,
        label: '4h',
        disabled: false
    },
    {
        interval: 24 * 60 * 60,
        label: '1d',
        disabled: false
    }
];

const rangeOptions = [
    {
        amount: 6,
        unit: 'hours'
    },
    {
        amount: 1,
        unit: 'days'
    },
    {
        amount: 4,
        unit: 'days'
    },
    {
        amount: 2,
        unit: 'weeks'
    },
    {
        amount: 3,
        unit: 'months'
    },
    {
        amount: 1,
        unit: 'years'
    },
    {
        unit: 'all'
    }
];

const defaultState = {
    interval: 60 * 60,
    start: startFromRangeOption(rangeOptions[1]),
    end: undefined,
    intervalOptions,
    rangeOptions,
    presetRangeIndex: 1
};

let _priceChart = (state, action, rootState) => {
    let newState = state ? {...state} : {...defaultState};
    let smallestAllowedInterval;
    let largestAllowedInterval;

    switch(action.type) {
        case UPDATE_INTERVAL:
            newState = {
                ...newState,
                interval: action.payload.interval
            };
            break;
        case UPDATE_RANGE:
            newState = {
                ...newState,
                start: action.payload.start,
                end: action.payload.end,
                presetRangeIndex: undefined
            };
            break;
        case PRESET_RANGE:
            newState = {
                ...newState,
                presetRangeIndex: action.payload.rangeIndex,
                start: startFromRangeOption(state.rangeOptions[action.payload.rangeIndex]),
                end: undefined
            };
            break;
        case UPDATE_ASSET_PAIR:
            newState = isNewAssetPair(rootState.exchange.assetPair, action.payload) ? {...defaultState} : {...state};
            break;
        default:
            break;
    }

    if (newState.start) {
        let startTime = moment(newState.start);
        let endTime = moment(newState.end);

        if (startTime.isAfter(endTime)) {
            endTime = moment();
        }

        const rangeSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
        smallestAllowedInterval = getSmallestAllowedInterval(intervalOptions, rangeSeconds);
        largestAllowedInterval = getLargestAllowedInterval(intervalOptions, rangeSeconds);
    }
    else {
        smallestAllowedInterval = 86400;
        largestAllowedInterval = 86400;
    }

    if (newState.interval < smallestAllowedInterval) {
        newState.interval = smallestAllowedInterval;
    }

    if (newState.interval > largestAllowedInterval) {
        newState.interval = largestAllowedInterval;
    }

    newState.intervalOptions = intervalOptions.map(o => {
        return {
            ...o,
            disabled: o.interval < smallestAllowedInterval || o.interval > largestAllowedInterval
        };
    });

    return newState;
};

export const priceChart = restrictReducerToNamespace(_priceChart, namespace);

function isNewAssetPair(oldAssetPair, newAssetPair) {
    return  oldAssetPair && newAssetPair &&
            !(
                oldAssetPair.buying.code === newAssetPair.buying.code &&
                oldAssetPair.buying.issuer === newAssetPair.buying.issuer &&
                oldAssetPair.selling.code === newAssetPair.selling.code &&
                oldAssetPair.selling.issuer === newAssetPair.selling.issuer
            ) &&
            !(
                oldAssetPair.buying.code === newAssetPair.selling.code &&
                oldAssetPair.buying.issuer === newAssetPair.selling.issuer &&
                oldAssetPair.selling.code === newAssetPair.buying.code &&
                oldAssetPair.selling.issuer === newAssetPair.buying.issuer
            );
}

function getSmallestAllowedInterval(intervalOptions, rangeSeconds) {
    const smallest = _find(intervalOptions, option => rangeSeconds / option.interval <= 500) || intervalOptions[intervalOptions.length - 1];
    return smallest.interval;
}

function getLargestAllowedInterval(intervalOptions, rangeSeconds) {
    const largest = _find(intervalOptions.slice().reverse(), option => rangeSeconds / option.interval >= 10) || intervalOptions[0];
    return largest.interval;
}

function startFromRangeOption(rangeOption) {
    return rangeOption.unit === 'all' ? undefined : moment.utc().subtract(rangeOption.amount, rangeOption.unit).toISOString();
}
