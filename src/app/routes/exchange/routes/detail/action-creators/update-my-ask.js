import {actionCreator} from 'au-redux';
import {UPDATE_MY_ASK} from '../detail.action-types';

@actionCreator()
export class UpdateMyAskActionCreator {

    create(myAsk) {
        return {
            type: UPDATE_MY_ASK,
            payload: myAsk
        }
    }
}
