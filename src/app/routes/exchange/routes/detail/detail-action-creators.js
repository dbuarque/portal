/**
 * Created by istrauss on 1/7/2017.
 */


import {inject} from 'aurelia-framework';
import {detailActionTypes} from './detail-action-types';
import {AccountResource} from 'app-resources';

const {UPDATE_ORDERBOOK, UPDATE_RECENT_TRADES, UPDATE_MY_OFFERS, UPDATE_MY_BID, UPDATE_MY_ASK, UPDATE_MY_ASSET_PAIR, UPDATE_DISPLAYED_OFFER_TYPE} = detailActionTypes;

@inject(AccountResource)
export class DetailActionCreators {

    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    updateDisplayedOfferType(newType) {
        return {
            type: UPDATE_DISPLAYED_OFFER_TYPE,
            payload: newType
        }
    }

    updateMyAsk(myAsk) {
        return {
            type: UPDATE_MY_ASK,
            payload: myAsk
        }
    }

    updateMyBid(myBid) {
        return {
            type: UPDATE_MY_BID,
            payload: myBid
        }
    }

    updateRecentTrades(recentTrades) {
        return {
            type: UPDATE_RECENT_TRADES,
            payload: recentTrades
        }
    }

    updateOrderbook(orderbook) {
        return {
            type: UPDATE_ORDERBOOK,
            payload: orderbook
        }
    }

    updateMyOffers() {
        return async (dispatch, getState) => {
            const state = getState();

            if (!state.myAccount || !state.exchange.assetPair) {
                return;
            }

            const offers = await this.accountResource.offersForMarket(state.myAccount.accountId, state.exchange.assetPair);

            return dispatch({
                type: UPDATE_MY_OFFERS,
                payload: offers
            });
        }
    }
    updateMyAssetPair() {
        return async (dispatch, getState) => {
            const state = getState();

            if (!state.myAccount || !state.exchange.assetPair) {
                return;
            }

            const offers = await this.accountResource.assetPairTrustlines(state.myAccount.accountId, state.exchange.assetPair);

            return dispatch({
                type: UPDATE_MY_ASSET_PAIR,
                payload: offers
            });
        }
    }
}
