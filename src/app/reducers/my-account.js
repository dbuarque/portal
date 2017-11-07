import _isEqual from 'lodash/isEqual';
import {UPDATE_MY_ACCOUNT_ID, UPDATE_MY_ACCOUNT, UPDATE_MY_ACCOUNT_SEQNUM} from '../app.action-types';

export function myAccount(state = null, action) {
    switch(action.type) {
        case UPDATE_MY_ACCOUNT_ID:
            return action.payload ?
                {
                    ...state,
                    accountId: action.payload
                } :
                undefined;
        case UPDATE_MY_ACCOUNT:
            return !_isEqual(state, action.payload) ? action.payload : state;
        case UPDATE_MY_ACCOUNT_SEQNUM:
            return {
                ...state,
                seqNum: action.payload
            };
        default:
            return state;
    }
}
