import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_MY_ASSET_PAIR} from '../detail.action-types';
import {AccountResource} from 'app-resources';

@actionCreator()
@inject(AccountResource)
export class UpdateMyAssetPairActionCreator {

    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    create() {
        return async (dispatch, getState) => {
            const state = getState();

            if (!state.myAccount || !state.exchange.assetPair) {
                return;
            }

            const assetPair = await this.accountResource.assetPairTrustlines(state.myAccount.accountId, state.exchange.assetPair);

            return dispatch({
                type: UPDATE_MY_ASSET_PAIR,
                payload: assetPair
            });
        }
    }
}
