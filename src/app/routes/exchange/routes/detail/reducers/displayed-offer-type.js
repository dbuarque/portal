/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_DISPLAYED_OFFER_TYPE} from '../detail.action-types';

export function displayedOfferType(state = 'bid', action) {
    return action.type === UPDATE_DISPLAYED_OFFER_TYPE ? action.payload : state;
}
