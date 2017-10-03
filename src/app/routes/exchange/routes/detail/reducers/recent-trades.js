
import {exchangeActionTypes} from '../../../exchange-action-types';
import {detailActionTypes} from '../detail-action-types';
import {isNewAssetPair} from './helpers';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;
const {UPDATE_RECENT_TRADES} = detailActionTypes;

export function recentTrades(state = [], action, rootState) {
    switch (action.type) {
        case UPDATE_RECENT_TRADES:
            return action.payload.concat(state).slice(0, 10);
        case UPDATE_ASSET_PAIR:
            if (!action.payload) {
                return [];
            }

            return isNewAssetPair(action.payload, rootState.exchange.assetPair) ? [] : state;
        default:
            return state;
    }
}

