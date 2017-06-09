/**
 * Created by istrauss on 1/7/2017.
 */


import {namespace, priceChartActionTypes} from './price-chart-action-types';

const {UPDATE_INTERVAL, UPDATE_RANGE, PRESET_RANGE} = priceChartActionTypes;

export class PriceChartActionCreators {
    updateInterval(interval) {
        return {
            type: UPDATE_INTERVAL,
            payload: {
                interval
            }
        };
    }

    updateRange(data) {
        return {
            type: UPDATE_RANGE,
            payload: {
                ...data
            }
        };
    }

    presetRange(rangeIndex) {
        return {
            type: PRESET_RANGE,
            payload: {
                rangeIndex
            }
        };
    }
}
