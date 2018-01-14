import {UPDATE_CAN_PROCEED} from '../create-account.action-types';

export function canProceed(state = true, action) {
    switch (action.type) {
        case UPDATE_CAN_PROCEED:
            return action.payload;
        default:
            return state;
    }
}
