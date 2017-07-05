/**
 * Created by istrauss on 1/4/2017.
 */

import {ReducerHelper} from 'global-resources';
import {namespace} from '../../exchange-action-types';
import {priceChart} from './price-chart/price-chart-reducers'
import {orderbookChart} from './orderbook-chart/orderbook-chart-reducers'

let _detail = ReducerHelper.combineReducersProvideRootState({
    priceChart,
    orderbookChart
});

export const detail = ReducerHelper.restrictReducerToNamespace(_detail, namespace);
