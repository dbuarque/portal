/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange-action-types';
import {detailActionTypes} from '../detail-action-types';
import {isNewAssetPair} from './helpers';

const {UPDATE_MY_OFFERS} = detailActionTypes;

export function myOffers(state, action) {
    switch (action.type) {
        case UPDATE_MY_OFFERS:
            return action.payload;
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}
