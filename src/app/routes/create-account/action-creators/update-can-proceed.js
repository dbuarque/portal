import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_CAN_PROCEED} from '../create-account.action-types';

@actionCreator()
export class UpdateCanProceedActionCreator {
    create(canProceed) {
        return {
            type: UPDATE_CAN_PROCEED,
            payload: canProceed
        };
    }
}
