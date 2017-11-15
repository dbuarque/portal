/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_ORDERBOOK, UPDATE_MY_ASK} from '../detail.action-types';
import {calculateNewOrder} from './helpers';

export function myAsk(state = null, action) {
    switch (action.type) {
        case UPDATE_MY_ASK:
            return calculateNewOrder(action.payload, state);
        case UPDATE_ORDERBOOK:
            if ((!state || !state.price) && action.payload && action.payload.bids && action.payload.bids.length > 0) {
                return {
                    price: [action.payload.bids[0].priceNumerator, action.payload.bids[0].priceDenominator]
                };
            }

            return state;
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}
