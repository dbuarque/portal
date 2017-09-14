/**
 * Created by istrauss on 1/4/2017.
 */

import BigNumber from 'bignumber.js';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, exchangeActionTypes} from './exchange-action-types';

const {UPDATE_ASSET_PAIR, UPDATE_ORDERBOOK} = exchangeActionTypes;

let _exchange = combineReducersProvideRootState({
    assetPair,
    orderbook
});

export const exchange = restrictReducerToNamespace(_exchange, namespace);

export function isNewAssetPair(oldAssetPair, newAssetPair) {
    return oldAssetPair && newAssetPair &&
        !(
            oldAssetPair.buying.code === newAssetPair.buying.code &&
            oldAssetPair.buying.issuer === newAssetPair.buying.issuer &&
            oldAssetPair.selling.code === newAssetPair.selling.code &&
            oldAssetPair.selling.isser === newAssetPair.selling.isser
        );
}

function assetPair(state, action) {
    return action.type === UPDATE_ASSET_PAIR ? action.payload : state;
}

function orderbook(state, action, rootState) {
    switch (action.type) {
        case UPDATE_ORDERBOOK:
            if (!action.payload) {
                return undefined;
            }

            if (action.payload.bids) {
                action.payload.bids = _mapOrders(action.payload.bids);
            }

            if (action.payload.asks) {
                action.payload.asks = _mapOrders(action.payload.asks);
            }

            return {
                ...state,
                ...action.payload
            };
        case UPDATE_ASSET_PAIR:
            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? undefined : state;
        default:
            return state;
    }
}


function _mapOrders(orders) {
    let sellingDepth = 0;
    let buyingDepth = 0;

    return orders.map(o => {
        sellingDepth = (new BigNumber(o.amount)).plus(sellingDepth).toString();
        buyingDepth = (new BigNumber(o.amount)).times(o.priceNumerator).dividedBy(o.priceDenominator).plus(buyingDepth).toString();
        return {
            ...o,
            sellingDepth: parseFloat(sellingDepth),
            buyingDepth: parseFloat(buyingDepth)
        }
    });
}
