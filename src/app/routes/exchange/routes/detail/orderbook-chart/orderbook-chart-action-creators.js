/**
 * Created by istrauss on 1/7/2017.
 */


import {namespace, orderbookChartActionTypes} from './orderbook-chart-action-types';

const {UPDATE_RANGE} = orderbookChartActionTypes;

export class OrderbookChartActionCreators {

    updateRange(data) {
        return {
            type: UPDATE_RANGE,
            payload: {
                ...data
            }
        };
    }
}
