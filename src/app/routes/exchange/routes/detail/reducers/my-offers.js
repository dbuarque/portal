/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_MY_OFFERS} from '../detail.action-types';

export function myOffers(state = [], action) {
    switch (action.type) {
        case UPDATE_MY_OFFERS:
            return action.payload;
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}
