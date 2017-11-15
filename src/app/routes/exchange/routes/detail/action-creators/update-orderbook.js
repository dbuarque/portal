import {actionCreator} from 'au-redux';
import {UPDATE_ORDERBOOK} from '../detail.action-types';

@actionCreator()
export class UpdateOrderbookActionCreator {

    create(orderbook) {
        return {
            type: UPDATE_ORDERBOOK,
            payload: orderbook
        }
    }
}
