/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange-action-types';
import {detailActionTypes} from '../detail-action-types';
import {isNewAssetPair, calculateNewOrder} from './helpers';

const {UPDATE_ORDERBOOK, UPDATE_MY_BID} = detailActionTypes;

export function myBid(state, action, rootState) {
    switch (action.type) {
        case UPDATE_MY_BID:
            return calculateNewOrder(action.payload, state);
        case UPDATE_ORDERBOOK:
            if ((!state || !state.price) && action.payload && action.payload.asks && action.payload.asks.length > 0) {
                return {
                    price: [action.payload.asks[0].priceDenominator, action.payload.asks[0].priceNumerator]
                };
            }

            return state;
        case UPDATE_ASSET_PAIR:
            if (!action.payload) {
                return undefined;
            }

            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? undefined : state;
        default:
            return state;
    }
}

function updateMyBid(newState, oldState) {

}
