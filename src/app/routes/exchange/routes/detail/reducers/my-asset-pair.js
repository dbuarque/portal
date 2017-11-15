/**
 * Created by istrauss on 9/18/2017.
 */

import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_MY_ASSET_PAIR} from '../detail.action-types';

export function myAssetPair(state = null, action) {
    switch (action.type) {
        case UPDATE_MY_ASSET_PAIR:
            return {
                selling: action.payload.selling || {},
                buying: action.payload.buying || {}
            };
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}
