/**
 * Created by istrauss on 1/4/2017.
 */

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, UPDATE_ASSET_PAIR} from './exchange-action-types';
import choose from './routes/choose/reducers';
import detail from './routes/detail/reducers';

export const exchange = restrictReducerToNamespace(
    combineReducersProvideRootState({
        assetPair,
        choose,
        detail
    }),
    namespace
);

function assetPair(state, action) {
    return action.type === UPDATE_ASSET_PAIR ?
        {
            ...state,
            ...action.payload
        } :
        state;
}
