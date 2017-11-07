import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {detailActionTypes} from '../detail-action-types';

const {UPDATE_RECENT_TRADES} = detailActionTypes;

export function recentTrades(state = [], action) {
    switch (action.type) {
        case UPDATE_RECENT_TRADES:
            return action.payload.concat(state).slice(0, 10);
        case UPDATE_ASSET_PAIR:
            return null;
        default:
            return state;
    }
}

