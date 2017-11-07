import {actionCreator} from 'au-redux';
import {UPDATE_MY_BID} from '../detail.action-types';

@actionCreator()
export class UpdateMyBidActionCreator {

    create(myBid) {
        return {
            type: UPDATE_MY_BID,
            payload: myBid
        }
    }
}
