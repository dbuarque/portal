/**
 * Created by istrauss on 9/18/2017.
 */

import BigNumber from 'bignumber.js';
import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_ORDERBOOK} from '../detail.action-types';

export function orderbook(state = null, action) {
    switch (action.type) {
        case UPDATE_ORDERBOOK:
            if (!action.payload) {
                return null;
            }

            return {
                bids: _mapOrders(action.payload.bids),
                asks: _mapOrders(action.payload.asks)
            };
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}

function _mapOrders(orders) {
    let sellingDepth = 0;
    let buyingDepth = 0;

    return orders.map(o => {
        sellingDepth = (new BigNumber(o.amount)).plus(sellingDepth).toString(10);
        buyingDepth = (new BigNumber(o.amount)).times(o.priceNumerator).dividedBy(o.priceDenominator).plus(buyingDepth).toString(10);
        return {
            ...o,
            sellingDepth: parseFloat(sellingDepth),
            buyingDepth: parseFloat(buyingDepth)
        }
    });
}
