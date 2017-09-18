/**
 * Created by istrauss on 1/4/2017.
 */

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, exchangeActionTypes} from './exchange-action-types';
import {detail} from './routes/detail/detail-reducers';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;

let _exchange = combineReducersProvideRootState({
    assetPair,
    detail
});

export const exchange = restrictReducerToNamespace(_exchange, namespace);

function assetPair(state, action) {
    return action.type === UPDATE_ASSET_PAIR ? action.payload : state;
}
