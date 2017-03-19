/**
 * Created by istrauss on 1/4/2017.
 */

import {ReducerHelper} from 'utils';
import {namespace, exchangeActionTypes} from './exchange-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;

let _exchange = ReducerHelper.combineReducersProvideRootState({
    assetPair
});

export const exchange = ReducerHelper.restrictReducerToNamespace(_exchange, namespace);

function assetPair(state, action) {
    return action.type === UPDATE_ASSET_PAIR ? {
        ...state,
        ...action.payload
    } : (state || {});
}
