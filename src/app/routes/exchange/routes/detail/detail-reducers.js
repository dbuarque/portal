/**
 * Created by istrauss on 1/4/2017.
 */

import BigNumber from 'bignumber.js';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {exchangeActionTypes} from '../../exchange-action-types';
import {detailActionTypes} from './detail-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;
const {UPDATE_ORDERBOOK, UPDATE_MY_OFFERS, UPDATE_NEW_OFFER} = detailActionTypes;

export const detail = combineReducersProvideRootState({
    newOffer,
    orderbook,
    myOffers
});

const initialNewOffer = {
    displayedType: 'bid'
};

function newOffer(state = initialNewOffer, action) {
    switch (action.type) {
        case UPDATE_NEW_OFFER:
            return {
                ...state,
                ...action.payload
            };
        case UPDATE_ORDERBOOK:
            return {
                ...state,
                askingPrice: state.askingPrice || (action.payload && action.payload.bids ? action.payload.bids[0].price : undefined),
                biddingPrice: state.biddingPrice || (action.payload && action.payload.asks ? action.payload.asks[0].price : undefined)
            };
        default:
            return state;
    }
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
            if (!action.payload) {
                return undefined;
            }

            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? undefined : state;
        default:
            return state;
    }
}

function myOffers(state, action, rootState) {
    switch (action.type) {
        case UPDATE_MY_OFFERS:
            return action.payload;
        case UPDATE_ASSET_PAIR:
            if (!action.payload) {
                return undefined;
            }

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
