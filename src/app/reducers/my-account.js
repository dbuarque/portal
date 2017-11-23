import {UPDATE_MY_ACCOUNT_ID, UPDATE_MY_ACCOUNT, UPDATE_MY_ACCOUNT_SEQNUM} from '../app.action-types';

export function myAccount(state = null, action) {
    switch (action.type) {
        case UPDATE_MY_ACCOUNT_ID:
            return {
                accountId: action.payload
            };
        case UPDATE_MY_ACCOUNT:
            return action.payload || null;
        case UPDATE_MY_ACCOUNT_SEQNUM:
            return {
                ...state,
                seqNum: action.payload
            };
        default:
            return state;
    }
}
