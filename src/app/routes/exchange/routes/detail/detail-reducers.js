/**
 * Created by istrauss on 1/4/2017.
 */

import {ReducerHelper} from 'global-resources';
import {namespace} from './detail-action-types';
import {priceChart} from './price-chart/price-chart-reducers'

let _detail = ReducerHelper.combineReducersProvideRootState({
    priceChart
});

export const detail = ReducerHelper.restrictReducerToNamespace(_detail, namespace);
