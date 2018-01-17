import {UPDATE_PUBLIC_KEY_METHOD_INDEX} from '../create-account.action-types';

export function publicKeyMethodIndex(state = 0, action) {
    switch (action.type) {
        case UPDATE_PUBLIC_KEY_METHOD_INDEX:
            return action.payload;
        default:
            return state;
    }
}
