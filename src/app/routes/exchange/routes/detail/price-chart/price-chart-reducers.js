/**
 * Created by istrauss on 1/4/2017.
 */

import moment from 'moment';
import _find from 'lodash.find';
import {ReducerHelper} from 'global-resources';
import {namespace, priceChartActionTypes} from './price-chart-action-types';

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

let _priceChart = (state, action) => {
    let interval, start, end, presetRangeIndex;
    let smallestAllowedInterval;
    let rangeSeconds;

    switch(action.type) {
        case UPDATE_INTERVAL:
            interval = action.payload.interval;
            start = state.start;
            end = state.end;
            presetRangeIndex = state.presetRangeIndex;
            break;
        case UPDATE_RANGE:
            start = action.payload.start;
            end = action.payload.end;
            interval = state.interval;
            presetRangeIndex = undefined;
            break;
        case PRESET_RANGE:
            presetRangeIndex = action.payload.rangeIndex;

            const times = timesFromRangeOption(state.rangeOptions[presetRangeIndex]);

            start = times.start;
            end = times.end;
            interval = state.interval;
            break;
        default:
            return state || {
                    interval: 60 * 60,
                    start: timesFromRangeOption(rangeOptions[1]).start,
                    end: moment.utc().toISOString(),
                    intervalOptions,
                    rangeOptions,
                    presetRangeIndex: 1
                };
    }

    if (start && end) {
        let startTime = moment(start);
        let endTime = moment(end);

        if (startTime.isAfter(endTime)) {
            endTime = moment();
        }

        rangeSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
        const numIntervals = rangeSeconds/interval;
        smallestAllowedInterval = getSmallestAllowedInterval(state.intervalOptions, rangeSeconds);
    }
    else {
        smallestAllowedInterval = 86400;
    }

    if (interval < smallestAllowedInterval) {
        interval = smallestAllowedInterval;
    }

    if (rangeSeconds && interval > rangeSeconds) {
        interval = smallestAllowedInterval;
    }

    const newIntervalOptions = state.intervalOptions.map(o => {
        return {
            ...o,
            disabled: o.interval < smallestAllowedInterval || (rangeSeconds && o.interval > rangeSeconds)
        };
    });

    return {
        ...state,
        interval,
        start,
        end,
        intervalOptions: newIntervalOptions,
        presetRangeIndex
    };
};

export const priceChart = ReducerHelper.restrictReducerToNamespace(_priceChart, namespace);

function getSmallestAllowedInterval(intervalOptions, rangeSeconds) {
    const smallest = _find(intervalOptions, option => rangeSeconds / option.interval <= 5000) || intervalOptions[intervalOptions.length - 1];
    return smallest.interval;
}

function timesFromRangeOption(rangeOption) {
    return {
        start: rangeOption.unit === 'all' ? undefined : moment.utc().subtract(rangeOption.amount, rangeOption.unit).toISOString(),
        end: rangeOption.unit === 'all' ? undefined : moment.utc().toISOString()
    };
}
