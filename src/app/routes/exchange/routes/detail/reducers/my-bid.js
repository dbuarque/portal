/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_ORDERBOOK, UPDATE_MY_BID} from '../detail.action-types';
import {calculateNewOrder} from './helpers';
export function myBid(state = null, action) {
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
            return null;
        default:
            return state;
    }
}

function updateMyBid(newState, oldState) {

}
