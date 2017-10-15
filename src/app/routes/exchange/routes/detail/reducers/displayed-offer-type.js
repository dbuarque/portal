/**
 * Created by istrauss on 9/18/2017.
 */

import {detailActionTypes} from '../detail-action-types';

const {UPDATE_DISPLAYED_OFFER_TYPE} = detailActionTypes;

export function displayedOfferType(state = 'bid', action) {
    return action.type === UPDATE_DISPLAYED_OFFER_TYPE ? action.payload : state;
}
