/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange-action-types';
import {detailActionTypes} from '../detail-action-types';
import {isNewAssetPair} from './helpers';

const {UPDATE_MY_OFFERS} = detailActionTypes;

export function myOffers(state, action, rootState) {
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
