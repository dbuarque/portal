import {inject} from 'aurelia-framework';
import {actionCreator} from 'au-redux';
import {UPDATE_MY_OFFERS} from '../detail.action-types';
import {AccountResource} from 'app-resources';

@actionCreator()
@inject(AccountResource)
export class UpdateMyOffersActionCreator {

    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    create() {
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
}
