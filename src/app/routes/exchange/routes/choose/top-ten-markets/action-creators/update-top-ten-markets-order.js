import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_TOP_TEN_ORDER} from '../top-ten-markets.action-types';

@actionCreator()
export class UpdateTopTenMarketsOrderActionCreator {

    create(order) {
        return {
            type: UPDATE_TOP_TEN_ORDER,
            payload: order
        };
    }
}
