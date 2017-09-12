/**
 * Created by istrauss on 1/4/2017.
 */

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace} from '../../exchange-action-types';
import {priceChart} from './price-chart/price-chart-reducers'

let _detail = combineReducersProvideRootState({
    priceChart
});

export const detail = restrictReducerToNamespace(_detail, namespace);
