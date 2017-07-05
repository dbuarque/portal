/**
 * Created by istrauss on 1/4/2017.
 */

import {ReducerHelper} from 'global-resources';
import {namespace, exchangeActionTypes} from './exchange-action-types';
import {detail} from './routes/detail/detail-reducers';

const {UPDATE_ASSET_PAIR, REFRESH_ORDERBOOK} = exchangeActionTypes;

let _exchange = ReducerHelper.combineReducersProvideRootState({
    assetPair,
    orderbook,
    detail
});

export const exchange = ReducerHelper.restrictReducerToNamespace(_exchange, namespace);

function assetPair(state, action) {
    return action.type === UPDATE_ASSET_PAIR ? action.payload : state;
}

function orderbook(state, action, rootState) {
    switch (action.type) {
        case REFRESH_ORDERBOOK:
            return action.payload;
        case UPDATE_ASSET_PAIR:
            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? undefined : state;
        default:
            return state;
    }
}

function isNewAssetPair(oldAssetPair, newAssetPair) {
    return oldAssetPair && newAssetPair &&
            !(
                oldAssetPair.buying.code === newAssetPair.buying.code &&
                oldAssetPair.buying.issuer === newAssetPair.buying.issuer &&
                oldAssetPair.selling.code === newAssetPair.selling.code &&
                oldAssetPair.selling.isser === newAssetPair.selling.isser
            );
}
