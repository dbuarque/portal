import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_TOP_TEN_RESULTS} from '../top-ten-markets.action-types';

@actionCreator()
export class UpdateTopTenMarketsActionCreator {
    create(markets) {
        return {
            type: UPDATE_TOP_TEN_RESULTS,
            payload: markets
        };
    }
}
