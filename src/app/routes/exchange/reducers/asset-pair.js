import {assetPairsAreDifferent} from 'app-resources';
import {UPDATE_ASSET_PAIR} from '../exchange.action-types';

export function assetPair(state = null, action) {
    return action.type === UPDATE_ASSET_PAIR && assetPairsAreDifferent(state, action.payload) ?
        {
            ...state,
            ...action.payload
        } :
        state;
}
