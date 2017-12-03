import {UPDATE_ASSET_PAIR} from '../../../exchange.action-types';
import {UPDATE_RECENT_TRADES} from '../detail.action-types';

export function recentTrades(state = [], action) {
    switch (action.type) {
        case UPDATE_RECENT_TRADES:
            return action.payload.replace ?
                action.payload.trades
                    .filter(t => hasEnoughVolume(t)) :
                action.payload.trades
                    .filter(t => hasEnoughVolume(t))
                    .concat(state).slice(0, 10);
        case UPDATE_ASSET_PAIR:
            return [];
        default:
            return state;
    }
}

function hasEnoughVolume(trade) {
    return parseFloat(trade.details.bought_amount, 10) > 0.000001 &&
        parseFloat(trade.details.sold_amount, 10) > 0.000001;
}
