import {actionCreator} from 'au-redux';
import {UPDATE_RECENT_TRADES} from '../detail.action-types';

@actionCreator()
export class UpdateRecentTradesActionCreator {

    create(recentTrades) {
        return {
            type: UPDATE_RECENT_TRADES,
            payload: recentTrades
        };
    }
}
