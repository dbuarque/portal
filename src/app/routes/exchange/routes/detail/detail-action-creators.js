/**
 * Created by istrauss on 1/7/2017.
 */


import {inject} from 'aurelia-framework';
import {detailActionTypes} from './detail-action-types';
import {AccountResource} from 'app-resources';

const {UPDATE_ORDERBOOK, UPDATE_MY_OFFERS, UPDATE_NEW_OFFER} = detailActionTypes;

@inject(AccountResource)
export class DetailActionCreators {

    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    updateNewOffer(newOffer) {
        return {
            type: UPDATE_NEW_OFFER,
            payload: newOffer
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

            if (!state.account || !state.exchange.assetPair) {
                return;
            }

            const offers = await this.accountResource.offersForMarket(state.account.id, state.exchange.assetPair);

            return dispatch({
                type: UPDATE_MY_OFFERS,
                payload: offers
            });
        }
    }
}
