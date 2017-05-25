/**
 * Created by istrauss on 1/4/2017.
 */

import _find from 'lodash.find';
import {ReducerHelper} from 'global-resources';
import {namespace, priceChartActionTypes} from './price-chart-action-types';

const {UPDATE_INTERVAL, UPDATE_RANGE} = priceChartActionTypes;

let _priceChart = (state, action) => {
    let interval, start, end;
    let smallestAllowedInterval;

    switch(action.type) {
        case UPDATE_INTERVAL:
            interval = action.payload.interval;
            start = action.payload.start;
            end = action.payload.end;
            break;
        case UPDATE_RANGE:
            start = action.payload.start;
            end = action.payload.end;
            interval = action.payload.interval;
            break;
        default:
            return state || {
                    interval: 5 * 60,
                    start: moment.utc().subtract(1, 'd').toISOString(),
                    end: moment.utc().toISOString(),
                    intervalOptions: [
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
                    ],
                    rangeOptions: [
                        {
                            amount: 6,
                            unit: 'h'
                        },
                        {
                            amount: 1,
                            unit: 'd'
                        },
                        {
                            amount: 4,
                            unit: 'd'
                        },
                        {
                            amount: 2,
                            unit: 'w'
                        },
                        {
                            amount: 3,
                            unit: 'm'
                        },
                        {
                            amount: 1,
                            unit: 'y'
                        },
                        {
                            unit: 'all'
                        }
                    ]
                };
    }

    if (start && end) {
        let startTime = moment(start);
        let endTime = moment(end);

        if (startTime.isAfter(endTime)) {
            endTime = moment();
        }

        const rangeSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
        const numIntervals = rangeSeconds/interval;
        smallestAllowedInterval = smallestAllowedInterval(state.intervalOptions, rangeSeconds);
    }
    else {
        smallestAllowedInterval = 86400;
    }

    if (interval > smallestAllowedInterval) {
        interval = smallestAllowedInterval;
    }

    const intervalOptions = state.intervalOptions.map(o => {
        return {
            ...o,
            disabled: interval < smallestAllowedInterval
        };
    });

    return {
        ...state,
        interval,
        start,
        end,
        intervalOptions
    };
};

export const priceChart = ReducerHelper.restrictReducerToNamespace(_priceChart, namespace);

function smallestAllowedInterval(intervalOptions, rangeSeconds) {
    return _find(intervalOptions, option => rangeSeconds / option.interval <= 5000);
}
